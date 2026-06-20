import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// =============================================================
// GET /api/capstones?studentId=xxx
//   Returns the capstone project for a student (creates one if not exists).
// =============================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "studentId is required" }, { status: 400 });
    }

    // Upsert — get or create the capstone project
    const capstone = await db.capstoneProject.upsert({
      where: { studentId }, // there's no unique on studentId alone, so use findFirst pattern
      create: { studentId, status: "NOT_STARTED" },
      update: {},
    });

    return NextResponse.json({ capstone });
  } catch (e: any) {
    // The upsert above won't work without a unique constraint — fall back to findFirst
    try {
      const { searchParams } = new URL(req.url);
      const studentId = searchParams.get("studentId");
      let capstone = await db.capstoneProject.findFirst({ where: { studentId: studentId! } });
      if (!capstone) {
        capstone = await db.capstoneProject.create({
          data: { studentId: studentId!, status: "NOT_STARTED" },
        });
      }
      return NextResponse.json({ capstone });
    } catch (e2: any) {
      console.error("[GET /api/capstones] error:", e2);
      return NextResponse.json({ error: "Failed to fetch capstone", detail: e2.message }, { status: 500 });
    }
  }
}

// =============================================================
// PUT /api/capstones
// Body: { studentId, ...fields }
// Updates the capstone project for a student.
// Supported fields: title, productBrief, targetAcos, targetTacos,
//   keywordResearch, campaignBlueprint, launchPlan, optimizationReport,
//   presentationUrl, status, submittedAt, reviewedBy, reviewedAt,
//   reviewNotes, grade
// =============================================================

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.studentId) {
      return NextResponse.json({ error: "studentId is required" }, { status: 400 });
    }

    // Find or create
    let capstone = await db.capstoneProject.findFirst({ where: { studentId: body.studentId } });
    if (!capstone) {
      capstone = await db.capstoneProject.create({
        data: { studentId: body.studentId, status: "NOT_STARTED" },
      });
    }

    // Build update payload with validation
    const data: any = {};
    const stringFields = [
      "title", "productBrief", "keywordResearch", "campaignBlueprint",
      "launchPlan", "optimizationReport", "presentationUrl", "reviewNotes", "grade",
    ];
    for (const f of stringFields) {
      if (typeof body[f] === "string") data[f] = body[f] || null;
    }
    if (typeof body.targetAcos === "number") data.targetAcos = body.targetAcos;
    if (typeof body.targetTacos === "number") data.targetTacos = body.targetTacos;

    const validStatuses = ["NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "APPROVED", "REJECTED"];
    if (validStatuses.includes(body.status)) {
      data.status = body.status;
      if (body.status === "SUBMITTED" && !capstone.submittedAt) {
        data.submittedAt = new Date();
      }
      if ((body.status === "APPROVED" || body.status === "REJECTED") && !capstone.reviewedAt) {
        data.reviewedAt = new Date();
      }
    }
    if (typeof body.reviewedBy === "string") data.reviewedBy = body.reviewedBy || null;

    const updated = await db.capstoneProject.update({
      where: { id: capstone.id },
      data,
    });

    // If status changed to SUBMITTED/APPROVED, update ProgressEntry for phase 4 capstoneDone
    if (data.status === "APPROVED") {
      await db.progressEntry.upsert({
        where: { studentId_phaseNumber: { studentId: body.studentId, phaseNumber: 4 } },
        create: { studentId: body.studentId, phaseNumber: 4, capstoneDone: true },
        update: { capstoneDone: true },
      });
    }

    return NextResponse.json({ capstone: updated });
  } catch (e: any) {
    console.error("[PUT /api/capstones] error:", e);
    return NextResponse.json({ error: "Failed to update capstone", detail: e.message }, { status: 500 });
  }
}

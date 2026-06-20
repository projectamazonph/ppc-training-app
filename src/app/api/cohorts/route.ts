import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listCohorts } from "@/lib/db-queries";

// =============================================================
// GET /api/cohorts — list all cohorts (with enrollment stats)
//   ?stats=true  — include enrollment counts
// =============================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeStats = searchParams.get("stats") === "true";
    const cohorts = await listCohorts(includeStats);
    return NextResponse.json({ count: cohorts.length, cohorts });
  } catch (e: any) {
    console.error("[GET /api/cohorts] error:", e);
    return NextResponse.json({ error: "Failed to list cohorts", detail: e.message }, { status: 500 });
  }
}

// =============================================================
// POST /api/cohorts — create a new cohort
// =============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!body.startDate) {
      return NextResponse.json({ error: "startDate is required" }, { status: 400 });
    }

    const existing = await db.cohort.findUnique({ where: { name: body.name } });
    if (existing) {
      return NextResponse.json({ error: `Cohort "${body.name}" already exists` }, { status: 409 });
    }

    const validStatuses = ["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"];
    const status = validStatuses.includes(body.status) ? body.status : "PLANNED";

    const cohort = await db.cohort.create({
      data: {
        name: body.name,
        description: body.description ?? null,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        status: status as any,
        maxStudents: typeof body.maxStudents === "number" ? body.maxStudents : null,
        instructorId: body.instructorId ?? null,
        metadata: body.metadata ?? null,
      },
    });

    return NextResponse.json({ cohort }, { status: 201 });
  } catch (e: any) {
    console.error("[POST /api/cohorts] error:", e);
    return NextResponse.json({ error: "Failed to create cohort", detail: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAction } from "@/lib/db-queries";

// =============================================================
// PUT /api/exercises/submissions/[id]/grade
// Body: { gradedBy, status?, score?, feedback? }
// Used by instructors to grade/return an exercise submission.
// =============================================================

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.gradedBy) {
      return NextResponse.json({ error: "gradedBy (instructor studentId) is required" }, { status: 400 });
    }

    // Verify the submission exists
    const existing = await db.exerciseSubmission.findUnique({
      where: { id },
      include: { exercise: { select: { code: true, title: true } }, student: { select: { id: true, name: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Verify the grader is an instructor or admin
    const grader = await db.student.findUnique({
      where: { id: body.gradedBy },
      select: { id: true, role: true, name: true },
    });
    if (!grader || (grader.role !== "INSTRUCTOR" && grader.role !== "ADMIN")) {
      return NextResponse.json({ error: "Only instructors and admins can grade submissions" }, { status: 403 });
    }

    // Build update payload
    const data: any = {
      gradedBy: body.gradedBy,
      gradedAt: new Date(),
    };

    const validStatuses = ["DRAFT", "SUBMITTED", "GRADED", "RETURNED"];
    if (validStatuses.includes(body.status)) {
      data.status = body.status;
    } else {
      data.status = "GRADED"; // default to GRADED when no status provided
    }

    if (typeof body.score === "number") data.score = body.score;
    if (typeof body.feedback === "string") data.feedback = body.feedback.trim() || null;

    const updated = await db.exerciseSubmission.update({
      where: { id },
      data,
      include: {
        exercise: { select: { id: true, code: true, title: true, type: true, module: { select: { code: true, phaseNumber: true } } } },
      },
    });

    // Write an audit log entry
    await logAction({
      actorId: body.gradedBy,
      action: "UPDATE",
      entityType: "exercise_submission",
      entityId: id,
      summary: `${grader.name} graded ${existing.student.name}'s submission for ${existing.exercise.code} (${data.status})`,
      changes: { status: data.status, score: data.score, feedback: data.feedback ? "added" : undefined },
    });

    // Notify the student
    await db.notification.create({
      data: {
        studentId: existing.student.id,
        type: data.status === "GRADED" ? "GRADE" : "INFO",
        title: `${existing.exercise.code} ${data.status === "GRADED" ? "graded" : "returned"}`,
        message: `Your submission for "${existing.exercise.title}" has been ${data.status.toLowerCase()} by ${grader.name}.${data.feedback ? ` Feedback: "${data.feedback.slice(0, 100)}"` : ""}`,
        link: "/myprofile",
      },
    });

    return NextResponse.json({ submission: updated });
  } catch (e: any) {
    console.error("[PUT /api/exercises/submissions/[id]/grade] error:", e);
    return NextResponse.json({ error: "Failed to grade submission", detail: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// =============================================================
// GET /api/auth/me?id=<studentId>
// Returns the public user + progress for the given ID.
// Used to rehydrate a logged-in session after page reload.
// =============================================================

function publicUser(s: any) {
  const { password, ...rest } = s;
  return rest;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id query param is required" }, { status: 400 });
    }

    const student = await db.student.findUnique({
      where: { id },
      include: { progress: { orderBy: { phaseNumber: "asc" } } },
    });

    if (!student) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: publicUser(student),
      progress: student.progress,
    });
  } catch (e: any) {
    console.error("[GET /api/auth/me] error:", e);
    return NextResponse.json(
      { error: "Failed to fetch session", detail: e.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Role, StudentStatus } from "@prisma/client";

// =============================================================
// POST /api/auth/signup
// Body: { name, email, password, cohort? }
// Creates a new STUDENT account and returns the public user + empty progress
// =============================================================

function publicUser(s: any) {
  const { password, ...rest } = s;
  return rest;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation
    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name is required (at least 2 characters)" },
        { status: 400 }
      );
    }
    if (!body.email || typeof body.email !== "string" || !body.email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }
    if (!body.password || typeof body.password !== "string" || body.password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase().trim();

    // Email uniqueness
    const existing = await db.student.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: `An account with "${email}" already exists. Try signing in instead.` },
        { status: 409 }
      );
    }

    // Create new student with default role=STUDENT, status=ACTIVE, phase=1, targetAcos=30
    const student = await db.student.create({
      data: {
        name: body.name.trim(),
        email,
        password: body.password, // demo only — real apps would hash with bcrypt
        role: "STUDENT" as Role,
        status: "ACTIVE" as StudentStatus,
        cohort: typeof body.cohort === "string" && body.cohort.trim() ? body.cohort.trim() : null,
        currentPhase: 1,
        targetAcos: 30,
      },
      include: { progress: true },
    });

    return NextResponse.json(
      {
        user: publicUser(student),
        progress: student.progress,
        welcome: `Welcome aboard, ${student.name.split(" ")[0]}! Your training journey starts now.`,
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("[POST /api/auth/signup] error:", e);
    return NextResponse.json(
      { error: "Signup failed", detail: e.message },
      { status: 500 }
    );
  }
}

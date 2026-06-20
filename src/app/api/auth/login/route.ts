import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { touchLogin, logAction } from "@/lib/db-queries";

// =============================================================
// POST /api/auth/login
// Body: { email, password }
// Returns: { user: PublicUser, progress: ProgressEntry[] } on success
//          401 on invalid credentials
//          403 on withdrawn/paused (still allowed, but flagged)
// Side effects:
//   - Updates student.lastLoginAt
//   - Creates an AuditLog entry
//   - Creates a SessionLog entry
// =============================================================

// Strip sensitive fields before returning to client
function publicUser(s: any) {
  const { password, ...rest } = s;
  return rest;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!body.password || typeof body.password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // Find student by email (case-insensitive)
    const student = await db.student.findUnique({
      where: { email: body.email.toLowerCase().trim() },
      include: { progress: { orderBy: { phaseNumber: "asc" } } },
    });

    if (!student) {
      return NextResponse.json(
        { error: `No account found for "${body.email}". Try signing up instead.` },
        { status: 401 }
      );
    }

    // Verify password (demo: plain string compare — real apps would use bcrypt)
    if (student.password !== body.password) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    // Withdrawn users cannot log in
    if (student.status === "WITHDRAWN") {
      return NextResponse.json(
        { error: "This account has been withdrawn. Contact your administrator." },
        { status: 403 }
      );
    }

    // Soft-deleted users cannot log in
    if (student.deletedAt) {
      return NextResponse.json(
        { error: "This account has been deactivated. Contact your administrator." },
        { status: 403 }
      );
    }

    // --- Side effects: update lastLoginAt, write audit log, session log ---
    await touchLogin(student.id);
    await logAction({
      actorId: student.id,
      action: "LOGIN",
      entityType: "student",
      entityId: student.id,
      summary: `${student.name} signed in`,
      ipAddress: req.headers.get("x-forwarded-for") ?? null,
    });
    await db.sessionLog.create({
      data: {
        studentId: student.id,
        userAgent: req.headers.get("user-agent") ?? null,
        ipAddress: req.headers.get("x-forwarded-for") ?? null,
      },
    });

    return NextResponse.json({
      user: publicUser(student),
      progress: student.progress,
      warning:
        student.status === "PAUSED"
          ? "Your account is currently paused. You can still browse the material."
          : null,
    });
  } catch (e: any) {
    console.error("[POST /api/auth/login] error:", e);
    return NextResponse.json(
      { error: "Login failed", detail: e.message },
      { status: 500 }
    );
  }
}

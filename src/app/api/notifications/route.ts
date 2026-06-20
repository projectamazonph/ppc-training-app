import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// =============================================================
// GET /api/notifications — list notifications for a student
//   ?studentId=xxx   ?unreadOnly=true
// =============================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    if (!studentId) {
      return NextResponse.json({ error: "studentId is required" }, { status: 400 });
    }

    const where: any = { studentId };
    if (unreadOnly) where.readAt = null;

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await db.notification.count({
      where: { studentId, readAt: null },
    });

    return NextResponse.json({
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (e: any) {
    console.error("[GET /api/notifications] error:", e);
    return NextResponse.json({ error: "Failed to list notifications", detail: e.message }, { status: 500 });
  }
}

// =============================================================
// PUT /api/notifications — mark as read
// Body: { id: "xxx" } or { studentId: "xxx", markAllRead: true }
// =============================================================

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.markAllRead && body.studentId) {
      const result = await db.notification.updateMany({
        where: { studentId: body.studentId, readAt: null },
        data: { readAt: new Date() },
      });
      return NextResponse.json({ markedRead: result.count });
    }

    if (body.id) {
      const notif = await db.notification.update({
        where: { id: body.id },
        data: { readAt: new Date() },
      });
      return NextResponse.json({ notification: notif });
    }

    return NextResponse.json({ error: "Provide either {id} or {studentId, markAllRead}" }, { status: 400 });
  } catch (e: any) {
    console.error("[PUT /api/notifications] error:", e);
    return NextResponse.json({ error: "Failed to update notification", detail: e.message }, { status: 500 });
  }
}

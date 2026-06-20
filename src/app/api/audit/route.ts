import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// =============================================================
// GET /api/audit — list audit log entries
//   ?actorId=xxx   ?action=CREATE   ?entityType=student   ?limit=50
// =============================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const actorId = searchParams.get("actorId");
    const action = searchParams.get("action");
    const entityType = searchParams.get("entityType");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10) || 50, 200);

    const where: any = {};
    if (actorId) where.actorId = actorId;
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    const logs = await db.auditLog.findMany({
      where,
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ count: logs.length, logs });
  } catch (e: any) {
    console.error("[GET /api/audit] error:", e);
    return NextResponse.json({ error: "Failed to list audit logs", detail: e.message }, { status: 500 });
  }
}

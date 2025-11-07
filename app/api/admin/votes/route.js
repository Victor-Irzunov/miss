// /app/api/admin/votes/route.js — СОЗДАЙ ФАЙЛ ПОЛНОСТЬЮ (сводка для админа)
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.SECRET_KEY || process.env.JWT_SECRET || "secret_miss_key";

function getUser(req) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch { return null; }
}

export async function GET(req) {
  try {
    const me = getUser(req);
    if (!me?.isAdmin) return NextResponse.json({ ok: false }, { status: 401 });

    const totals = await prisma.vote.groupBy({
      by: ["girlId"],
      _count: { girlId: true },
    });

    const girls = await prisma.girl.findMany({
      select: { id: true, firstName: true, lastName: true, city: true, slug: true, mainImage: true },
    });

    const mapGirl = Object.fromEntries(girls.map(g => [g.id, g]));
    const summary = totals
      .map(t => ({ girlId: t.girlId, total: t._count.girlId, girl: mapGirl[t.girlId] }))
      .sort((a,b) => b.total - a.total);

    const lastVotes = await prisma.vote.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true, createdAt: true,
        girl: { select: { id: true, slug: true, firstName: true, lastName: true } },
        user: { select: { id: true, email: true } },
      },
    });

    return NextResponse.json({ ok: true, summary, lastVotes });
  } catch (e) {
    console.error("GET /api/admin/votes error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

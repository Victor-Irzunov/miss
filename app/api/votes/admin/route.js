// /app/api/votes/admin/route.js
// GET: только для админа (Bearer token_miss). Возвращает сводку по девочкам и список голосов.

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret_miss_key";

function getPayload(req) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function GET(req) {
  const payload = getPayload(req);
  if (!payload?.isAdmin) return NextResponse.json({ ok: false }, { status: 401 });

  const [girls, votes] = await Promise.all([
    prisma.girl.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        firstName: true,
        lastName: true,
        city: true,
        _count: { select: { votes: true } },
      },
    }),
    prisma.vote.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        girl: { select: { id: true, slug: true, firstName: true, lastName: true } },
        user: { select: { id: true, email: true } },
      },
    }),
  ]);

  const summary = girls.map((g) => ({
    girlId: g.id,
    slug: g.slug,
    name: `${g.firstName} ${g.lastName}`,
    city: g.city,
    total: g._count.votes,
  }));

  return NextResponse.json({ ok: true, summary, votes });
}

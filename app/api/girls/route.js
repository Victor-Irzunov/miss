// /app/api/girls/route.js — убираем жёсткий take; если ?limit не передан — отдаем всех
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(Math.max(Number(limitParam), 1), 1000) : null;

    const where = q
      ? {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { city: { contains: q } },
          ],
        }
      : {};

    const items = await prisma.girl.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: limit } : {}), // ← без limit вернём всех
      select: {
        id: true,
        slug: true,
        firstName: true,
        lastName: true,
        city: true,
        age: true,
        mainImage: true,
        images: true,
        description: true,
      },
    });

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error("GET /api/girls error:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}

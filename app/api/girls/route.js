// /app/api/girls/route.js — ПОЛНОСТЬЮ (добавлена категория и флаг победителя)
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    const where = q
      ? {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { city: { contains: q } },
          ],
        }
      : {};

    const itemsRaw = await prisma.girl.findMany({
      where,
      orderBy: { createdAt: "desc" },
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
        category: true,
        categoryWinner: { select: { category: true } }, // null | {category}
        _count: { select: { votes: true } },
      },
    });

    const items = itemsRaw.map((g) => ({
      ...g,
      votesCount: g._count?.votes ?? 0,
      _count: undefined,
      categoryWinner: g.categoryWinner ? true : false,
    }));

    return NextResponse.json({ ok: true, items });
  } catch (e) {
    console.error("GET /api/girls error:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}

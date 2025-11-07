import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const winners = await prisma.categoryWinner.findMany({
      include: {
        girl: {
          include: { _count: { select: { votes: true } } }, // ← считаем голоса
        },
      },
    });

    const items = (winners || [])
      .filter((w) => !!w.girl)
      .map((w) => ({
        category: w.category,
        girl: {
          id: w.girl.id,
          slug: w.girl.slug,
          firstName: w.girl.firstName,
          lastName: w.girl.lastName,
          city: w.girl.city,
          age: w.girl.age,
          mainImage: w.girl.mainImage,
          votesCount: w.girl._count?.votes ?? 0,
        },
      }));

    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (e) {
    console.error("GET /api/winners error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

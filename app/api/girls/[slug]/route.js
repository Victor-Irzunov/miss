import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// один Prisma на процесс
const prisma = globalThis.__prisma || new PrismaClient();
if (!globalThis.__prisma) globalThis.__prisma = prisma;

export async function GET(_req, ctx) {
  try {
    // ⬇️ ВАЖНО: в App Router `params` — Promise, его нужно await-нуть
    const { slug = "" } = (ctx?.params && typeof ctx.params.then === "function")
      ? (await ctx.params) || {}
      : ctx?.params || {};

    if (!slug) {
      return NextResponse.json({ ok: false, message: "slug required" }, { status: 400 });
    }

    const girl = await prisma.girl.findUnique({
      where: { slug },
      include: {
        _count: { select: { votes: true } },
      },
    });

    if (!girl) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }

    // Приводим ответ к стабильному формату
    const item = {
      id: girl.id,
      slug: girl.slug,
      firstName: girl.firstName,
      lastName: girl.lastName,
      city: girl.city,
      age: girl.age,
      description: girl.description,
      mainImage: girl.mainImage,
      images: Array.isArray(girl.images) ? girl.images : [],
      videos: Array.isArray(girl.videos) ? girl.videos : [], // ✅ видео массивом
      category: girl.category,
      createdAt: girl.createdAt,
      updatedAt: girl.updatedAt,
      votesCount: girl._count?.votes ?? 0, // ✅ количество голосов
    };

    return NextResponse.json({ ok: true, item }, { status: 200 });
  } catch (e) {
    console.error("GET /api/girls/[slug] error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

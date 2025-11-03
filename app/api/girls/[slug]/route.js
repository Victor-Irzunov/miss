import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(_req, ctx) {
  try {
    // В новых Next `params` — это Promise
    const { slug } = await ctx.params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ ok: false, message: "Bad slug" }, { status: 400 });
    }

    const item = await prisma.girl.findUnique({
      where: { slug },
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

    if (!item) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item });
  } catch (e) {
    console.error("GET /api/girls/[slug] error:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}

// /app/api/admin/winner/route.js — ПОЛНОСТЬЮ (установка победителя в категории через транзакцию)
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

/**
 * POST { girlId: number }
 * 1) находит участницу, узнаёт её category
 * 2) в транзакции апсетит CategoryWinner(category -> girlId)
 *    (один победитель на категорию)
 */
export async function POST(req) {
  try {
    const me = getUser(req);
    if (!me?.isAdmin) return NextResponse.json({ ok: false }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const girlId = Number(body?.girlId || 0);
    if (!girlId) return NextResponse.json({ ok: false, message: "girlId required" }, { status: 400 });

    const girl = await prisma.girl.findUnique({ where: { id: girlId } });
    if (!girl) return NextResponse.json({ ok: false, message: "Girl not found" }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      // просто апсерт по ключу category — всегда один победитель на категорию
      await tx.categoryWinner.upsert({
        where: { category: girl.category },
        update: { girlId },
        create: { category: girl.category, girlId },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/admin/winner error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/winner
 * body: { category?: "PLUS35" | "PLUS50" | "PLUS60" | "ONLINE" }
 * если category отсутствует — 400
 */
export async function DELETE(req) {
  try {
    const me = getUser(req);
    if (!me?.isAdmin) return NextResponse.json({ ok: false }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const category = (body?.category || "").toString().toUpperCase();
    if (!category) return NextResponse.json({ ok: false, message: "category required" }, { status: 400 });

    await prisma.categoryWinner.delete({ where: { category } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/admin/winner error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

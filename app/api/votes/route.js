// /app/api/votes/route.js
// POST: проголосовать { girlId } (Bearer token_miss).
// GET: статус и количество ?girlId= (youVoted — если уже голосовал в ЭТОЙ категории).

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.SECRET_KEY || process.env.JWT_SECRET || "secret_miss_key";

function getUserIdFromAuth(req) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return null;
    const payload = jwt.verify(token, JWT_SECRET);
    return payload?.id || null;
  } catch {
    return null;
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const girlId = Number(searchParams.get("girlId") || 0);
    if (!girlId) {
      return NextResponse.json({ ok: false, message: "girlId required" }, { status: 400 });
    }

    // Находим категорию по girlId
    const girl = await prisma.girl.findUnique({
      where: { id: girlId },
      select: { id: true, category: true },
    });
    if (!girl) return NextResponse.json({ ok: false, message: "Girl not found" }, { status: 404 });

    const userId = getUserIdFromAuth(req);

    // Сколько голосов у выбранной участницы
    const total = await prisma.vote.count({ where: { girlId } });

    // Голосовал ли пользователь В ЭТОЙ КАТЕГОРИИ
    let youVoted = false;
    if (userId) {
      const existingInCategory = await prisma.vote.findFirst({
        where: { userId, category: girl.category },
        select: { id: true },
      });
      youVoted = !!existingInCategory;
    }

    return NextResponse.json({ ok: true, total, youVoted });
  } catch (e) {
    console.error("GET /api/votes error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = getUserIdFromAuth(req);
    if (!userId) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const girlId = Number(body.girlId || 0);
    if (!girlId) {
      return NextResponse.json({ ok: false, message: "girlId required" }, { status: 400 });
    }

    // Проверим участницу и узнаем её категорию
    const girl = await prisma.girl.findUnique({
      where: { id: girlId },
      select: { id: true, category: true },
    });
    if (!girl) {
      return NextResponse.json({ ok: false, message: "Girl not found" }, { status: 404 });
    }

    // Уже голосовал в ЭТОЙ КАТЕГОРИИ?
    const existsInCategory = await prisma.vote.findFirst({
      where: { userId, category: girl.category },
      select: { id: true },
    });
    if (existsInCategory) {
      return NextResponse.json(
        {
          ok: false,
          message: "Вы уже голосовали в этой категории",
        },
        { status: 409 }
      );
    }

    // Создаём голос (фиксируем category в записи)
    await prisma.vote.create({
      data: {
        userId,
        girlId,
        category: girl.category,
      },
    });

    const total = await prisma.vote.count({ where: { girlId } });
    return NextResponse.json({ ok: true, total });
  } catch (e) {
    // P2002 — защита на всякий (повторный голос за ту же участницу)
    if (String(e?.code) === "P2002") {
      return NextResponse.json(
        { ok: false, message: "Вы уже голосовали в этой категории" },
        { status: 409 }
      );
    }
    console.error("POST /api/votes error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

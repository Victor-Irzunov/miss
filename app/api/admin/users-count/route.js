// /app/api/admin/users-count/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.SECRET_KEY || process.env.JWT_SECRET || "secret_miss_key";

function isAdmin(req) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const payload = jwt.verify(token, SECRET);
    return !!payload?.isAdmin;
  } catch {
    return false;
  }
}

export async function GET(req) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const count = await prisma.user.count({ where: { isAdmin: false } });
    return NextResponse.json({ ok: true, count });
  } catch (e) {
    console.error("GET /api/admin/users-count error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

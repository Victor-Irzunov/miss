// /app/api/user/login/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return new NextResponse("Проверьте email или пароль", { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return new NextResponse("Проверьте email или пароль", { status: 401 });

    const token = jwt.sign(
      { email: user.email, id: user.id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (e) {
    console.error("LOGIN error:", e);
    return new NextResponse("Ошибка входа!", { status: 500 });
  }
}

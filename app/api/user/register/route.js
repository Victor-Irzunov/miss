// /app/api/user/register/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password, isAdmin = false } = await req.json();

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return new NextResponse("Пользователь уже зарегистрирован", { status: 401 });

    if (isAdmin) {
      const adminExists = await prisma.user.findFirst({ where: { isAdmin: true } });
      if (adminExists) return new NextResponse("Администратор уже существует", { status: 401 });
    }

    const hashed = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: { email, password: hashed, isAdmin: Boolean(isAdmin) },
    });

    const token = jwt.sign(
      { email: user.email, id: user.id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (e) {
    console.error("REGISTER error:", e);
    return new NextResponse("Ошибка регистрации!", { status: 500 });
  }
}

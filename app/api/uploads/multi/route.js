// /app/api/uploads/multi/route.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";          // важно: файловая система нужна
export const dynamic = "force-dynamic";   // не кэшируем
export const preferredRegion = "auto";

function sanitizeSubdir(s) {
  return String(s || "").replace(/^\/+|\/+$/g, "").replace(/\.\./g, "");
}

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true });
}

async function saveOneFile(baseDir, file) {
  const name = uuidv4() + ".webp";
  const filePath = path.join(baseDir, name);
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.promises.writeFile(filePath, buf);
  return name;
}

// Быстрый ping, чтобы убедиться что маршрут доступен
export async function GET() {
  return NextResponse.json({ ok: true, where: "/api/uploads/multi" });
}

export async function POST(req) {
  try {
    const form = await req.formData();

    // subdir = папка внутри /public/uploads/
    const subdir = sanitizeSubdir(form.get("subdir"));
    const originals = form.getAll("originals"); // Files[]
    const thumbs = form.getAll("thumbs");       // Files[] (можно те же)

    if (!originals || originals.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Не переданы файлы (originals[])" },
        { status: 400 }
      );
    }

    const baseDir = path.resolve(process.cwd(), "public", "uploads", subdir || "");
    await ensureDir(baseDir);

    const out = [];
    for (let i = 0; i < originals.length; i++) {
      const orig = originals[i];
      const th = thumbs[i] || orig;
      if (!orig || typeof orig !== "object") continue;

      const savedOriginal = await saveOneFile(baseDir, orig);
      const savedThumb = await saveOneFile(baseDir, th);

      const prefix = `/uploads${subdir ? "/" + subdir : ""}`;
      out.push({
        originalUrl: `${prefix}/${savedOriginal}`,
        thumbUrl: `${prefix}/${savedThumb}`,
      });
    }

    return NextResponse.json({ ok: true, files: out }, { status: 200 });
  } catch (e) {
    console.error("UPLOAD /api/uploads/multi error:", e);
    return NextResponse.json(
      { ok: false, message: "Ошибка загрузки" },
      { status: 500 }
    );
  }
}

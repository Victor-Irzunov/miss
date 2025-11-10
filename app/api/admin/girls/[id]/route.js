// /app/api/admin/girls/[id]/route.js
import { PrismaClient, GirlCategory } from "@prisma/client";
import { NextResponse } from "next/server";
import multer from "multer";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const uploadDir = path.resolve(process.cwd(), "public/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, _file, cb) => cb(null, uuidv4() + ".webp"),
});
const upload = multer({ storage, limits: { fileSize: 150 * 1024 } });

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0430-\u044fa-ÿ\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureUniqueSlugExcept(base, excludeId) {
  const root = slugify(base) || uuidv4();
  let candidate = root;
  let i = 2;
  while (true) {
    const exists = await prisma.girl.findFirst({
      where: { slug: candidate, NOT: { id: excludeId } },
      select: { id: true },
    });
    if (!exists) return candidate;
    candidate = `${root}-${i++}`;
    if (i > 200) return `${root}-${uuidv4().slice(0, 8)}`;
  }
}

function coerceVideos(input) {
  try {
    let arr = [];
    if (Array.isArray(input)) arr = input;
    else if (typeof input === "string") arr = JSON.parse(input || "[]");
    const cleaned = (Array.isArray(arr) ? arr : [])
      .map((s) => String(s || "").trim())
      .filter(Boolean);
    return Array.from(new Set(cleaned));
  } catch {
    return [];
  }
}

export async function PUT(req, ctx) {
  try {
    const { id: idRaw } = await ctx.params;
    const id = Number(idRaw);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ ok: false, message: "Bad id" }, { status: 400 });
    }

    const pre = await req.formData();
    const useJson = pre.get("imagesJson");

    // YouTube
    const videosJson = pre.get("videosJson");
    const multipleVideos = pre.getAll("videos");
    const videos = multipleVideos?.length
      ? coerceVideos(multipleVideos)
      : coerceVideos(typeof videosJson === "string" ? videosJson : "[]");

    // VK — НОВОЕ
    const vkVideosJson = pre.get("vkVideosJson");
    const multipleVk = pre.getAll("vkVideos");
    const vkVideos = multipleVk?.length
      ? coerceVideos(multipleVk)
      : coerceVideos(typeof vkVideosJson === "string" ? vkVideosJson : "[]");

    const data = {
      firstName: pre.get("firstName") || undefined,
      lastName: pre.get("lastName") || undefined,
      city: pre.get("city") || undefined,
      age: pre.get("age") ? Number(pre.get("age")) : undefined,
      description: pre.get("description") || undefined,
      slug: pre.get("slug") || undefined,
      videos,   // перезаписываем массив YouTube
      vkVideos, // перезаписываем массив VK
    };

    if (pre.has("category")) {
      const rawCategory = (pre.get("category") || "").toString().toUpperCase();
      if (rawCategory && rawCategory in GirlCategory) {
        data["category"] = rawCategory;
      }
    }

    let mainImage;
    let images;

    if (useJson) {
      try {
        images = JSON.parse(pre.get("imagesJson") || "[]");
      } catch {
        images = [];
      }
      mainImage = images?.[0];
    } else {
      await new Promise((resolve, reject) => {
        upload.any()(req, {}, (err) => (err ? reject(err) : resolve()));
      });

      const form = await req.formData();
      const main = form.get("mainImage");
      const list = form.getAll("images");
      const imgs = [];

      if (main && typeof main === "object") {
        const name = uuidv4() + ".webp";
        const p = path.join(uploadDir, name);
        const buf = Buffer.from(await main.arrayBuffer());
        await fs.promises.writeFile(p, buf);
        mainImage = `/uploads/${name}`;
      }

      for (const f of list) {
        if (!f || typeof f !== "object") continue;
        const name = uuidv4() + ".webp";
        const p = path.join(uploadDir, name);
        const buf = Buffer.from(await f.arrayBuffer());
        await fs.promises.writeFile(p, buf);
        imgs.push(`/uploads/${name}`);
      }

      if (imgs.length) images = imgs;
      if (!mainImage && images?.length) mainImage = images[0];
    }

    if (mainImage) data["mainImage"] = mainImage;
    if (images) data["images"] = images;

    if (typeof data.slug === "string") {
      const base = data.slug.trim()
        ? data.slug
        : `${data.firstName || ""}-${data.lastName || ""}-${data.city || ""}`;
      data.slug = await ensureUniqueSlugExcept(base, id);
    }

    const updated = await prisma.girl.update({
      where: { id },
      data,
      include: { categoryWinner: true },
    });
    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    console.error("PUT /api/admin/girls/[id] error:", e);
    return new NextResponse("Update error", { status: 500 });
  }
}

export async function DELETE(_req, ctx) {
  try {
    const { id: idRaw } = await ctx.params;
    const id = Number(idRaw);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ ok: false, message: "Bad id" }, { status: 400 });
    }
    await prisma.girl.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/admin/girls/[id] error:", e);
    return new NextResponse("Delete error", { status: 500 });
  }
}

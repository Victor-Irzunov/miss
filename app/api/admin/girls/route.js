// /app/api/admin/girls/route.js
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

// Нормализация и уникализация списка видео (принимаем JSON-строку или массив)
function coerceVideos(input) {
  try {
    let arr = [];
    if (Array.isArray(input)) {
      arr = input;
    } else if (typeof input === "string") {
      // пришел JSON
      arr = JSON.parse(input || "[]");
    }
    const cleaned = (Array.isArray(arr) ? arr : [])
      .map((s) => String(s || "").trim())
      .filter(Boolean);
    return Array.from(new Set(cleaned));
  } catch {
    return [];
  }
}

async function ensureUniqueSlug(base) {
  const root = slugify(base) || uuidv4();
  let candidate = root;
  let i = 2;
  while (true) {
    const exists = await prisma.girl.findFirst({ where: { slug: candidate } });
    if (!exists) return candidate;
    candidate = `${root}-${i++}`;
    if (i > 200) return `${root}-${uuidv4().slice(0, 8)}`;
  }
}

// export async function POST(req) {
//   try {
//     const pre = await req.formData();

//     const firstName = pre.get("firstName") || "";
//     const lastName = pre.get("lastName") || "";
//     const city = pre.get("city") || "";
//     const age = Number(pre.get("age") || 18);
//     const description = pre.get("description") || "";
//     const providedSlug = pre.get("slug") || "";
//     const imagesJson = pre.get("imagesJson");

//     // ВИДЕО: поддержка videosJson (JSON-строка) и videos[] (многократные поля)
//     const videosJson = pre.get("videosJson");
//     const multipleVideos = pre.getAll("videos"); // если кто-то отправит как videos[]=...
//     const videos = multipleVideos?.length
//       ? coerceVideos(multipleVideos)
//       : coerceVideos(typeof videosJson === "string" ? videosJson : "[]");

//     const rawCategory = (pre.get("category") || "PLUS35").toString().toUpperCase();
//     const category = rawCategory in GirlCategory ? rawCategory : "PLUS35";

//     let mainImage = "";
//     let images = [];

//     if (imagesJson) {
//       try {
//         images = JSON.parse(imagesJson || "[]");
//       } catch {
//         images = [];
//       }
//       mainImage = images[0] || "";
//     } else {
//       await new Promise((resolve, reject) => {
//         upload.any()(req, {}, (err) => (err ? reject(err) : resolve()));
//       });

//       const form = await req.formData();
//       const main = form.get("mainImage");
//       const list = form.getAll("images");

//       if (main && typeof main === "object") {
//         const name = uuidv4() + ".webp";
//         const filePath = path.join(uploadDir, name);
//         const buf = Buffer.from(await main.arrayBuffer());
//         await fs.promises.writeFile(filePath, buf);
//         mainImage = `/uploads/${name}`;
//       }

//       for (const f of list) {
//         if (!f || typeof f !== "object") continue;
//         const name = uuidv4() + ".webp";
//         const filePath = path.join(uploadDir, name);
//         const buf = Buffer.from(await f.arrayBuffer());
//         await fs.promises.writeFile(filePath, buf);
//         images.push(`/uploads/${name}`);
//       }
//       if (!mainImage && images.length) mainImage = images[0];
//     }

//     const baseForSlug =
//       providedSlug || `${firstName}-${lastName}-${city}` || uuidv4();
//     const slug = await ensureUniqueSlug(baseForSlug);

//     const created = await prisma.girl.create({
//       data: {
//         slug,
//         firstName,
//         lastName,
//         city,
//         age,
//         description,
//         mainImage: mainImage || "",
//         images,
//         videos, // <— сохраняем ВСЕ ссылки
//         category,
//       },
//     });

//     return NextResponse.json({ ok: true, item: created }, { status: 201 });
//   } catch (e) {
//     console.error("POST /api/admin/girls error:", e);
//     return new NextResponse("Upload or save error", { status: 500 });
//   }
// }

export async function POST(req) {
  try {
    const pre = await req.formData();

    const firstName = String(pre.get("firstName") || "").trim();
    const lastName = String(pre.get("lastName") || "").trim();
    const city = String(pre.get("city") || "").trim();
    const age = Number(pre.get("age") || 0);
    const description = String(pre.get("description") || "");
    const providedSlug = String(pre.get("slug") || "");
    const imagesJson = pre.get("imagesJson");

    // ВИДЕО
    const videosJson = pre.get("videosJson");
    const multipleVideos = pre.getAll("videos");
    const videos = multipleVideos?.length
      ? coerceVideos(multipleVideos)
      : coerceVideos(typeof videosJson === "string" ? videosJson : "[]");

    const rawCategory = String(pre.get("category") || "PLUS35").toUpperCase();
    const category = rawCategory in GirlCategory ? rawCategory : "PLUS35";

    // ===== ВАЛИДАЦИЯ ВХОДА (даём 400, а не 500) =====
    if (!firstName || !lastName || !city) {
      return NextResponse.json({ ok: false, message: "Missing firstName/lastName/city" }, { status: 400 });
    }
    if (!Number.isFinite(age) || age < 16 || age > 100) {
      return NextResponse.json({ ok: false, message: "Age must be 16–100" }, { status: 400 });
    }

    // Картинки — принимаем ТОЛЬКО imagesJson (как у вас на клиенте)
    let mainImage = "";
    let images = [];
    if (imagesJson) {
      try {
        const tmp = JSON.parse(String(imagesJson || "[]"));
        images = Array.isArray(tmp) ? tmp.map(s => String(s || "").trim()).filter(Boolean) : [];
      } catch {
        return NextResponse.json({ ok: false, message: "imagesJson is not valid JSON array" }, { status: 400 });
      }
      if (images.length === 0) {
        return NextResponse.json({ ok: false, message: "At least one image is required" }, { status: 400 });
      }
      mainImage = images[0] || "";
    } else {
      // На всякий случай поддержим fallback со старыми формами
      await new Promise((resolve, reject) => {
        upload.any()(req, {}, (err) => (err ? reject(err) : resolve()));
      });
      const form = await req.formData();
      const list = form.getAll("images");
      for (const f of list) {
        if (!f || typeof f !== "object") continue;
        const name = uuidv4() + ".webp";
        const filePath = path.join(uploadDir, name);
        const buf = Buffer.from(await f.arrayBuffer());
        await fs.promises.writeFile(filePath, buf);
        images.push(`/uploads/${name}`);
      }
      if (images.length === 0) {
        return NextResponse.json({ ok: false, message: "No images uploaded" }, { status: 400 });
      }
      mainImage = images[0];
    }

    const baseForSlug = providedSlug || `${firstName}-${lastName}-${city}` || uuidv4();
    const slug = await ensureUniqueSlug(baseForSlug);

    const created = await prisma.girl.create({
      data: {
        slug,
        firstName,
        lastName,
        city,
        age,
        description,
        mainImage,
        images,
        videos,
        category,
      },
    });

    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/girls error:", e);
    // Если это Prisma-ошибка об уникальности — вернём 409, чтобы на фронте было понятно
    if (String(e?.code || "").toLowerCase().includes("p2002") || String(e?.message || "").includes("Unique constraint")) {
      return NextResponse.json({ ok: false, message: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ ok: false, message: "Upload or save error" }, { status: 500 });
  }
}








export async function GET() {
  const items = await prisma.girl.findMany({
    orderBy: { createdAt: "desc" },
    include: { categoryWinner: true },
  });
  return NextResponse.json({ ok: true, items });
}

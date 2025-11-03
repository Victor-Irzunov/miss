// /lib/uploadGallery.js — загрузка новых файлов в /api/uploads/multi, возврат массива URL
export async function uploadGalleryIfNeeded(gallery, subdir = "girls") {
  const newFiles = gallery.filter((g) => g.file instanceof File);
  if (newFiles.length === 0) {
    return gallery.map((g) => g.url).filter(Boolean);
  }
  const form = new FormData();
  form.append("subdir", subdir);
  newFiles.forEach((it) => form.append("originals", it.file));
  newFiles.forEach((it) => form.append("thumbs", it.file));

  const resp = await fetch("/api/uploads/multi", { method: "POST", body: form });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || !data?.ok) throw new Error(data?.message || "Не удалось загрузить изображения");

  const uploaded = Array.isArray(data.files) ? data.files : [];
  const result = [];
  let take = 0;
  for (const it of gallery) {
    if (it.file instanceof File) {
      const u = uploaded[take++];
      result.push(u?.originalUrl || u?.thumbUrl || "");
    } else {
      result.push(it.url || "");
    }
  }
  return result.filter(Boolean);
}

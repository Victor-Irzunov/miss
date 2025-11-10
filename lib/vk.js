// /lib/vk.js

/** Приводим любые vk-ссылки к каноническому page-URL (vk.com/video…):
 * поддерживаем vk.com / m.vk.com / vkvideo.ru
 */
export function normalizeVkPageUrl(raw = "") {
  const s = String(raw || "").trim();
  const m = s.match(/(?:vk\.com|m\.vk\.com|vkvideo\.ru)\/video(-?\d+)_(\d+)/i);
  return m ? `https://vk.com/video${m[1]}_${m[2]}` : "";
}

/** Очистка массива ссылок: нормализация домена, trim, уникализация */
export function sanitizeVkInputs(arr) {
  const normed = (arr || [])
    .map((s) => normalizeVkPageUrl(String(s || "")))
    .filter(Boolean);
  return Array.from(new Set(normed));
}

// /lib/sanitizeHtmlClient.js — УБЕДИСЬ, ЧТО ФАЙЛ ЕСТЬ И ИМЕНЕМ В ТОЧНОСТИ
export function stripTags(html = "") {
  return String(html).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function truncateText(s = "", max = 160) {
  const t = String(s);
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

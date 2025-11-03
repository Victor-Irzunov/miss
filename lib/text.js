// /lib/text.js
// Простой набор текстовых утилит: stripTags, truncateText, yearsWord

/** Удаляем HTML-теги и приводим пробелы к одному */
export function stripTags(html = "") {
  return String(html).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/** Обрезаем текст до max символов c троеточием */
export function truncateText(s = "", max = 160) {
  const t = String(s);
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

/** Склонение "год / года / лет" по числу */
export function yearsWord(n) {
  const a = Math.abs(Number(n)) || 0;
  const last2 = a % 100;
  if (last2 >= 11 && last2 <= 14) return "лет";
  const last = a % 10;
  if (last === 1) return "год";
  if (last >= 2 && last <= 4) return "года";
  return "лет";
}

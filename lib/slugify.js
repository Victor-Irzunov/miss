// /lib/slugify.js — транслитерация + безопасный slug
export function slugify(raw = "") {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh",
    щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
    ї: "i", є: "e", ґ: "g", і: "i",
  };
  let s = String(raw).trim().toLowerCase();
  s = s.replace(/[а-яёіїєґ]/g, (ch) => map[ch] ?? ch);
  s = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/&/g, " and ");
  s = s.replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (s.length > 140) s = s.slice(0, 140).replace(/-+$/g, "");
  return s || "item";
}

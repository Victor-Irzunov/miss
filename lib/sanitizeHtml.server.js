// /lib/sanitizeHtml.server.js
/** Серверная «санитация» без DOMPurify: превращаем в plain text */
export function sanitizeHtml(html = "") {
  return String(html).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

// /lib/youtube.js

/** Извлечь videoId из разных форматов YouTube-ссылок */
export function extractYouTubeId(raw = "") {
  if (!raw) return "";

  const url = raw.trim();

  // youtu.be/<id>
  let m = url.match(/^https?:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  // watch?v=<id>
  m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  // /shorts/<id>
  m = url.match(/^https?:\/\/(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  // /embed/<id>
  m = url.match(/^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  // Иногда кидают только ID или странную строку — попробуем вытащить 11-символьный шаблон
  m = url.match(/([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : "";
}

/** Вернуть канонический watch-URL */
export function normalizeYouTubeWatchUrl(raw = "") {
  const id = raw.length === 11 ? raw : extractYouTubeId(raw);
  return id ? `https://www.youtube.com/watch?v=${id}` : "";
}

/** Embed-URL (для iframe) */
export function toYouTubeEmbedUrl(raw = "") {
  const id = raw.length === 11 ? raw : extractYouTubeId(raw);
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

/** Картинка-превью */
export function youtubeThumb(raw = "", quality = "hqdefault.jpg") {
  const id = raw.length === 11 ? raw : extractYouTubeId(raw);
  return id ? `https://i.ytimg.com/vi/${id}/${quality}` : "";
}

/** Очистить массив ссылок: трим, нормализация, убрать пустые и дубли */
export function sanitizeVideoInputs(inputsArray) {
  const normalized = (inputsArray || [])
    .map((s) => normalizeYouTubeWatchUrl(String(s || "").trim()))
    .filter(Boolean);
  return Array.from(new Set(normalized));
}

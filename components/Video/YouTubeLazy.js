// /components/Video/YouTubeLazy.jsx
"use client";

import { useEffect, useRef, useState } from "react";

/** Принимает либо полный URL, либо ID. Автопарсит. */
function toId(urlOrId = "") {
  const s = String(urlOrId).trim();
  if (!s) return "";
  const m1 = s.match(/[?&]v=([^&#]+)/i);
  if (m1) return m1[1];
  const m2 = s.match(/youtu\.be\/([^?&#/]+)/i);
  if (m2) return m2[1];
  const m3 = s.match(/youtube\.com\/shorts\/([^?&#/]+)/i);
  if (m3) return m3[1];
  return s; // похоже на id
}

export default function YouTubeLazy({ url, title = "Видео" }) {
  const id = toId(url);
  const [ready, setReady] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => e.isIntersecting && setReady(true)),
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const src = ready
    ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white`
    : undefined;

  return (
    <div ref={ref} className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-black/40">
      {/* 16:9 контейнер */}
      <div className="pt-[56.25%]" />
      {src ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-white/70 text-sm">
          Загружаем видео…
        </div>
      )}
    </div>
  );
}

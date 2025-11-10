"use client";

import { useEffect, useRef, useState, useMemo } from "react";

/** Поддерживаем vk.com / m.vk.com / vkvideo.ru (video<oid>_<id>) и video_ext.php */
function parseVkVideo(input) {
  const raw = String(input || "").trim();

  // video page url
  let m = raw.match(/(?:vk\.com|m\.vk\.com|vkvideo\.ru)\/video(-?\d+)_(\d+)/i);
  if (m) {
    return {
      oid: Number(m[1]),
      id: Number(m[2]),
      pageUrl: `https://vk.com/video${m[1]}_${m[2]}`,
      hash: null,
    };
  }

  // embed url
  m = raw.match(/video_ext\.php\?[^#]*\boid=(-?\d+)\b[^#]*\bid=(\d+)\b[^#]*?(?:\bhash=([a-z0-9_%-]+))?/i);
  if (m) {
    return {
      oid: Number(m[1]),
      id: Number(m[2]),
      pageUrl: `https://vk.com/video${m[1]}_${m[2]}`,
      hash: m[3] || null,
    };
  }

  return null;
}

function buildEmbedSrc({ oid, id, hash, hd = 2 }) {
  const base = `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=${hd}`;
  return hash ? `${base}&hash=${encodeURIComponent(hash)}` : base;
}

export default function VKVideoLazy({ url, title = "VK Video" }) {
  const holderRef = useRef(null);
  const [ready, setReady] = useState(false);

  const parsed = useMemo(() => parseVkVideo(url), [url]);

  useEffect(() => {
    if (!holderRef.current) return;
    const io = new IntersectionObserver(
      (ents) => {
        if (ents.some((e) => e.isIntersecting)) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(holderRef.current);
    return () => io.disconnect();
  }, []);

  if (!parsed) {
    return (
      <div className="w-full rounded-lg overflow-hidden">
        <a href={url} target="_blank" rel="noreferrer" className="underline">
          Открыть видео VK
        </a>
      </div>
    );
  }

  const src = buildEmbedSrc(parsed);

  return (
    <div ref={holderRef} className="w-full rounded-lg overflow-hidden bg-black/20">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {ready ? (
          <iframe
            src={src}
            title={title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/70">
            Загрузка видео…
          </div>
        )}
      </div>
    </div>
  );
}

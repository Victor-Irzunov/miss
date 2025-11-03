"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function Gallery({ images = [], alt = "" }) {
  const list = useMemo(
    () => (Array.isArray(images) && images.length ? images : []),
    [images]
  );
  const [idx, setIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + list.length) % list.length);
  }, [list.length]);

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % list.length);
  }, [list.length]);

  const openFullscreen = useCallback(() => setIsOpen(true), []);
  const closeFullscreen = useCallback(() => setIsOpen(false), []);

  // Клавиатура: ← → Esc
  useEffect(() => {
    const onKey = (e) => {
      if (isOpen) {
        if (e.key === "Escape") return closeFullscreen();
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, prev, next, closeFullscreen]);

  // Блокируем скролл страницы при открытом модальном окне
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!list.length) return null;

  return (
    <div className="relative">
      {/* Большое изображение с кнопкой полноэкранного просмотра */}
      <div className="relative aspect-3/4 rounded-2xl border overflow-hidden">
        <Image
          src={list[idx]}
          alt={alt}
          width={1200}
          height={1600}
          className="w-full h-full object-cover"
          priority
        />

        {/* Кнопка fullscreen (правый верхний угол) */}
        <button
          type="button"
          onClick={openFullscreen}
          className="absolute right-3 top-3 z-20 inline-flex items-center justify-center rounded-lg bg-black/50 hover:bg-black/70 transition-colors p-2"
          aria-label="Открыть на весь экран"
        >
          <Image src="/svg/fullscreen.svg" alt="" width={20} height={20} />
        </button>

        {/* Стрелки навигации по большому изображению */}
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/45 hover:bg-black/70 transition-colors p-2"
              aria-label="Предыдущее фото"
            >
              <Image src="/svg/arrow-left.svg" alt="" width={24} height={24} />
            </button>

            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/45 hover:bg-black/70 transition-colors p-2"
              aria-label="Следующее фото"
            >
              <Image src="/svg/arrow-right.svg" alt="" width={24} height={24} />
            </button>
          </>
        )}
      </div>

      {/* Превьюшки */}
      {list.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIdx(i)}
              className={`w-28 h-28 rounded border overflow-hidden shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                i === idx ? "ring-2 ring-violet-500" : ""
              }`}
              aria-label={`Показать фото ${i + 1}`}
            >
              <Image
                src={src}
                alt=""
                width={200}
                height={200}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Полноэкранный просмотр (модалка) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-999 bg-black/80 flex items-center justify-center p-4"
          onClick={closeFullscreen}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрыть (красный крестик) */}
            <button
              type="button"
              onClick={closeFullscreen}
              className="absolute right-4 top-3 z-10 rounded-full bg-red-600 hover:bg-red-700 transition-colors p-2"
              aria-label="Закрыть"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Большое изображение в модалке */}
            <div className="relative w-full aspect-3/2 rounded-xl overflow-hidden">
              <Image
                src={list[idx]}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain bg-black"
                priority
              />
            </div>

            {/* Стрелки в модалке */}
            {list.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 hover:bg-black/80 transition-colors p-3"
                  aria-label="Предыдущее фото"
                >
                  <Image
                    src="/svg/arrow-left.svg"
                    alt=""
                    width={28}
                    height={28}
                  />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 hover:bg-black/80 transition-colors p-3"
                  aria-label="Следующее фото"
                >
                  <Image
                    src="/svg/arrow-right.svg"
                    alt=""
                    width={28}
                    height={28}
                  />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

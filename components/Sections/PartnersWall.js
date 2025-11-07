"use client";

import Image from "next/image";

export default function PartnersWall() {
  // Положи файлы в /public (или скорректируй пути ниже)
  const IMG_DESKTOP = "/fon/section-1.webp";          // версия для компьютеров
  const IMG_MOBILE  = "/fon/section-1-mobile.webp";   // версия для мобильных

  return (
    <section
      aria-label="Наши постоянные партнёры — баннер"
      className="relative w-full"
      id="partners"
    >
      <div className="container mx-auto my-9">
        {/* ЕДИНЫЙ КАРТОЧНЫЙ БЛОК */}
        <div className="relative rounded-3xl overflow-hidden bg-white">
          {/* ===== ШАПКА (белый фон внутри карточки) ===== */}
          <div className="sd:hidden xz:flex items-center justify-between px-4 sd:px-6 py-3 sd:py-4">
            <Image
              src="/logo/logo-b.webp"
              alt="Академия моды Марины Кабадарян"
              width={120}
              height={120}
              className="h-10 w-auto sd:h-12 object-contain"
              priority
            />
            <h2 className="uppercase text-neutral-900 text-sm sd:text-xl font-extrabold tracking-wider">
              Наши постоянные партнёры
            </h2>
          </div>

          {/* Тонкая разделительная линия (внутри карточки) */}
          <div className="h-px bg-black/10" />

          {/* ===== ОБЛАСТЬ С ФОНОВЫМ ИЗОБРАЖЕНИЕМ ===== */}
          <div className="relative">
            {/* Desktop картинка */}
            <Image
              src={IMG_DESKTOP}
              alt="Наши постоянные партнёры"
              fill
              priority
              className="hidden sd:block object-cover"
              sizes="(min-width: 992px) 100vw, 0px"
            />
            {/* Mobile картинка */}
            <Image
              src={IMG_MOBILE}
              alt="Наши постоянные партнёры"
              fill
              priority
              className="sd:hidden"
              sizes="(max-width: 991px) 100vw, 0px"
            />

            {/* Лёгкий верхний градиент для мягкого перехода от белой шапки к фото */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-white to-transparent" />

            {/* Фиксатор высоты (чтобы блок не схлопывался) */}
            <div className="sd:min-h-[105vh] xz:min-h-[46vh]" />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const NAV = [
  { label: "ПРО КОНКУРС", href: "/about" },
  { label: "НОВИНИ ТА ПОДІЇ", href: "/news" },
  { label: "ЗМІ ПРО НАС", href: "/media" },
  { label: "ПЕРЕМОЖНИЦІ", href: "/winners" },
  { label: "ГАЛЕРЕЯ", href: "/gallery" },
  { label: "ПАРТНЕРИ", href: "/partners" },
  { label: "КОНТАКТИ", href: "/contacts" },
];

// ВАЖНО: подберите брейкпоинт под ваш "sd".
// В большинстве сетапов Tailwind lg=1024px. Здесь берём 1024px.
const DESKTOP_MEDIA = "(min-width: 1024px)";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Определяем десктоп/мобайл по matchMedia и следим за ресайзом
  useEffect(() => {
    const mm = window.matchMedia(DESKTOP_MEDIA);
    const onChange = () => setIsDesktop(mm.matches);
    onChange();
    mm.addEventListener?.("change", onChange);
    return () => mm.removeEventListener?.("change", onChange);
  }, []);

  // На десктопе: включаем blur после 100px скролла. На мобайле blur всегда.
  useEffect(() => {
    if (!isDesktop) {
      setScrolled(true); // мобайл — всегда blur
      return;
    }
    // десктоп — слушаем скролл
    const onScroll = () => setScrolled(window.scrollY >= 100);
    onScroll(); // инициализация
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  // Блокируем скролл документа, когда открыт мобильный дровер
  useEffect(() => {
    if (open) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => (document.documentElement.style.overflow = "");
  }, [open]);

  return (
    <header
      role="banner"
      className={`
        fixed top-0 inset-x-0 z-50
        border-b border-white/10
        transition-[backdrop-filter] duration-300
        ${scrolled ? "backdrop-blur" : ""}
      `}
    >
      {/* Верхняя полоса: логотип + меню */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* ЛОГО */}
        <Link href="/" className="flex items-center gap-3 min-w-64px xz:border-r sd:border-none border-white/10" aria-label="На главную">
          <Image
            src="/logo/logo.webp"
            alt="Академия моды Мараны Кабадарян"
            width={48}
            height={48}
            className="h-16 w-auto"
            priority
          />
        </Link>

        {/* ДЕСКТОП-МЕНЮ */}
        <nav
          className="
            xz:hidden sd:flex
            items-center justify-between
            text-white font-semibold tracking-wide
            w-full pl-6
          "
          aria-label="Главное меню"
        >
          <ul className="flex items-center w-full">
            {NAV.map((item, i) => (
              <li
                key={item.href}
                className={`
                  relative
                  px-6 h-16 flex items-center
                  ${"border-l border-white/10"}
                `}
              >
                <Link
                  href={item.href}
                  className="
                    uppercase text-sm
                    hover:opacity-90 focus:opacity-90
                    outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded
                  "
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* КНОПКА-БУРГЕР (мобайл) */}
        <button
          type="button"
          className="sd:hidden absolute right-0 z-50 h-10 w-10 inline-flex items-center justify-center"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {/* Три линии — анимируем в крест */}
          <span
            className={`
              absolute block h-0.5 w-7 bg-white transition-transform duration-300
              ${open ? "translate-y-0 rotate-45" : "-translate-y-2 rotate-0"}
            `}
          />
          <span
            className={`
              absolute block h-0.5 w-7 bg-white transition-opacity duration-300
              ${open ? "opacity-0" : "opacity-100"}
            `}
          />
          <span
            className={`
              absolute block h-0.5 w-7 bg-white transition-transform duration-300
              ${open ? "translate-y-0 -rotate-45" : "translate-y-2 rotate-0"}
            `}
          />
        </button>
      </div>

      {/* Бэктроп под дровером */}
      <div
        className={`
          sd:hidden fixed inset-0 z-40
          bg-black/50 transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Дровер (выезжает слева направо) */}
      <aside
        className={`
          sd:hidden fixed top-0 left-0 z-50 h-screen w-[84%] max-w-[420px]
          bg-[#151515] text-white
          transform transition-transform duration-300 will-change-transform
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Мобильное меню"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Image
              src="/logo/logo.webp"
              alt="Академия моды Мараны Кабадарян"
              width={44}
              height={44}
              className="h-11 w-auto"
              priority
            />
          </Link>

          {/* Крест (та же кнопка по стилю) */}
          {/* <button
            type="button"
            className="relative h-10 w-10 inline-flex items-center justify-center"
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
          >
            <span className="absolute block h-0.5 w-7 bg-white rotate-45" />
            <span className="absolute block h-0.5 w-7 bg-white -rotate-45" />
          </button> */}
        </div>

        <nav className="px-4 py-6" role="navigation">
          <ul className="space-y-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="
                    block uppercase font-extrabold text-2xl leading-none
                    hover:opacity-90 focus:opacity-90
                    outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded
                  "
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import phoneNumbers from "@/config/config";

/** Те же пункты, что и в шапке */
const NAV = [
  { label: "Главная", id: "main" },
  { label: "События", id: "events" },
  { label: "Стоимость", id: "price" },
  { label: "Партнёры", id: "partners" },
  { label: "Участницы", id: "girls" },
  { label: "Организаторы", id: "organizers" },
  { label: "Контакты", id: "contacts" },
];

const STORAGE_KEY = "pendingScrollTarget";
const DESKTOP_MEDIA = "(min-width: 1024px)";

/** реальная высота фиксированной шапки (если есть) + небольшой отступ */
function getHeaderHeight() {
  const h =
    document.querySelector("header")?.getBoundingClientRect().height ?? 64;
  return h + 8;
}

/** точный скролл до id с учётом высоты шапки */
function scrollToId(id, behavior = "smooth") {
  const realId = id === "main" ? "top" : id;
  const target = document.getElementById(realId);
  if (!target) return false;

  const top =
    target.getBoundingClientRect().top + window.scrollY - getHeaderHeight();
  window.scrollTo({ top, behavior });
  history.replaceState?.(null, "", `#${realId}`);
  return true;
}

/** ретрай, если секция ещё не дорендерилась (изображения, шрифты и т.п.) */
function retryScrollToId(id, tries = 20, delay = 50) {
  return new Promise((resolve) => {
    const attempt = (left) => {
      requestAnimationFrame(() => {
        const ok = scrollToId(id, left === tries ? "auto" : "smooth");
        if (ok) return resolve(true);
        if (left <= 1) return resolve(false);
        setTimeout(() => attempt(left - 1), delay);
      });
    };
    attempt(tries);
  });
}

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const footerRef = useRef(null);

  /** admin-токен */
  useEffect(() => {
    const readToken = () => {
      try {
        const token = localStorage.getItem("token_miss");
        if (!token) return setIsAdmin(false);
        const payload = jwtDecode(token);
        const notExpired =
          typeof payload?.exp !== "number" ? true : payload.exp * 1000 > Date.now();
        setIsAdmin(Boolean(payload?.isAdmin) && notExpired);
      } catch {
        setIsAdmin(false);
      }
    };
    readToken();
    const onStorage = (e) => e.key === "token_miss" && readToken();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /** desktop/mobile */
  useEffect(() => {
    const mm = window.matchMedia(DESKTOP_MEDIA);
    const onChange = () => setIsDesktop(mm.matches);
    onChange();
    mm.addEventListener?.("change", onChange);
    return () => mm.removeEventListener?.("change", onChange);
  }, []);

  /** клик по пунктам футера — как в шапке */
  const handleNavClick = (e, id) => {
    e.preventDefault();
    if (onHome) {
      retryScrollToId(id);
    } else {
      try {
        sessionStorage.setItem(STORAGE_KEY, id);
      } catch { }
      const hash = id === "main" ? "" : `#${id}`;
      router.push(`/${hash}`);
    }
  };

  /** клик по лого в футере — к началу главной */
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (onHome) {
      retryScrollToId("main");
    } else {
      try {
        sessionStorage.setItem(STORAGE_KEY, "main");
      } catch { }
      router.push("/");
    }
  };

  /** докрутка после перехода на главную */
  useEffect(() => {
    if (!onHome) return;
    let target = "";
    try {
      target = sessionStorage.getItem(STORAGE_KEY) || "";
      if (target) sessionStorage.removeItem(STORAGE_KEY);
    } catch { }
    if (!target && location.hash && location.hash.length > 1) {
      const raw = location.hash.slice(1);
      target = raw === "top" ? "main" : raw;
    }
    if (!target) return;
    const t = setTimeout(() => retryScrollToId(target), 50);
    return () => clearTimeout(t);
  }, [onHome]);

  const {
    phone1,
    phone1Link,
    phone1Social,
    phone2,
    phone2Link,
    youtubeUrl,
    instagramUrl,
  } = phoneNumbers;

  // Ссылки соцсетей из конфига/по номеру
  const tgHref = phone1Social ? `https://t.me/${phone1Social}` : "https://t.me/";
  const viberHref = phone1Social
    ? `https://viber.click/${phone1Social}`
    : "https://www.viber.com/";

  return (
    <footer
      ref={footerRef}
      id="contacts"
      className="relative text-white"
      aria-labelledby="footer-title"
      style={{
        background:
          "linear-gradient(180deg, rgba(20,24,38,1) 5%, rgba(28,31,46,1) 40%, rgba(86,71,52,1) 100%)",
      }}
    >
      {/* Контент */}
      <div className="container mx-auto sd:px-0 xz:px-3">
        <div className="grid sd:grid-cols-12 xz:grid-cols-1 gap-6 sd:py-16 xz:py-10 items-start">
          {/* Левая колонка — логотип */}
          <div className="sd:col-span-5 xz:order-2 sd:order-0">
            <div className="opacity-30 select-none">
              <a
                href={onHome ? "#top" : "/"}
                onClick={handleLogoClick}
                aria-label="К началу страницы"
                className="inline-block"
              >
                <Image
                  src="/logo/logo.webp"
                  alt="Женщина 2025"
                  width={300}
                  height={300}
                  className=""
                  priority={false}
                />
              </a>
            </div>
          </div>

          {/* Правая колонка — контакты, соцсети, вход/админ */}
          <div className="sd:col-span-7 xz:order-1 sd:order-0">
            <h2 id="footer-title" className="sr-only">
              Контакты и ссылки
            </h2>

            {/* Телефоны */}
            <div className="py-4 border-b border-white/10">
              <p className="uppercase tracking-widest text-xs text-white/60">
                Телефоны
              </p>

              <div className="space-y-2 text-xl sd:text-2xl font-bold mt-9">
                {/* Организатор */}
                {phone1 && (
                  <div className="flex sd:flex-row xz:flex-col sd:items-center xz:items-start gap-3">
                    <span className="text-white/60 text-xs uppercase tracking-widest">
                      Организатор
                    </span>
                    <a
                      href={`tel:${phone1Link || phone1}`}
                      className="hover:opacity-90"
                      aria-label={`Позвонить организатору ${phone1}`}
                    >
                      {phone1}
                    </a>
                    {/* Быстрые ссылки (опционально) */}
                    {phone1Social && (
                      <div className="flex items-center gap-2 ml-2">
                        <a
                          href={`https://t.me/${phone1Social}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded border border-white/30 px-2 py-1 text-xs hover:bg-white/10"
                          aria-label="Написать в Telegram"
                        >
                          Telegram
                        </a>
                        <a
                          href={`https://wa.me/${phone1Social}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded border border-white/30 px-2 py-1 text-xs hover:bg-white/10"
                          aria-label="Написать в WhatsApp"
                        >
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Основатель */}
                {phone2 && (
                  <div className="flex sd:flex-row xz:flex-col sd:items-center xz:items-start mt-6 gap-3">
                    <span className="text-white/60 text-xs uppercase tracking-widest">
                      Основатель
                    </span>
                    <a
                      href={`tel:${phone2Link || phone2}`}
                      className="hover:opacity-90"
                      aria-label={`Позвонить основателю ${phone2}`}
                    >
                      {phone2}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Почта №1 */}
            <div className="py-4 border-b border-white/10">
              <p className="uppercase tracking-widest text-xs text-white/60">
                По общим вопросам
              </p>
              <a
                href="mailto:info@woman2025.by"
                className="mt-2 inline-block text-3xl sd:text-5xl font-extrabold"
              >
                info@woman2025.by
              </a>
            </div>

            {/* Почта №2 */}
            <div className="py-4 border-b border-white/10">
              <p className="uppercase tracking-widest text-xs text-white/60">
                По вопросам кастинга
              </p>
              <a
                href="mailto:casting@woman2025.by"
                className="mt-2 inline-block text-3xl sd:text-5xl font-extrabold"
              >
                casting@woman2025.by
              </a>
            </div>

            {/* Соцсети + CTA */}
            <div className="flex sd:flex-row xz:flex-col sd:items-center xz:items-start gap-4 sd:gap-6 py-6">
              <p className="uppercase tracking-widest text-xs text-white/60 mr-1 sd:mr-4">
                Социальные сети
              </p>

              <div className="flex items-center gap-3 sd:gap-4">
                {/* Telegram — по телефону из config */}
                <a
                  href={tgHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Telegram"
                  className="rounded-full border border-white/30 p-3 hover:bg-white/10 transition"
                >
                  <img src="/svg/telegram.svg" alt="" className="w-5 h-5" loading="lazy" />
                </a>

                {/* YouTube — из config */}
                <a
                  href={youtubeUrl || "https://youtube.com/"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="rounded-full border border-white/30 p-3 hover:bg-white/10 transition"
                >
                  <img src="/svg/youtube.svg" alt="" className="w-5 h-5" loading="lazy" />
                </a>

                {/* Instagram — из config */}
                <a
                  href={instagramUrl || "https://instagram.com/"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="rounded-full border border-white/30 p-3 hover:bg-white/10 transition"
                >
                  <img src="/svg/instagram.svg" alt="" className="w-5 h-5" loading="lazy" />
                </a>

                {/* Viber — вместо TikTok, по телефону из config */}
                <a
                  href={viberHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Viber"
                  className="rounded-full border border-white/30 p-3 hover:bg-white/10 transition"
                >
                  <img src="/svg/viber.svg" alt="" className="w-5 h-5" loading="lazy" />
                </a>
              </div>

              <div className="xz:mt-12 sd:mt-0">
                {isAdmin ? (
                  <Link
                    href="/admin/girls"
                    className="btn btn-sm sd:btn-md btn-outline text-white"
                  >
                    Админ панель
                  </Link>
                ) : (
                  <Link
                    href="/login?from=admin"
                    className="btn btn-sm sd:btn-md btn-neutral"
                  >
                    Вход
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Нижнее меню: якоря как в шапке */}
        <nav
          className="grid sd:grid-cols-6 xz:grid-cols-2 gap-3 sd:gap-6 border-t border-white/10 sd:py-8 xz:py-6 text-sm font-semibold"
          aria-label="Footer navigation"
        >
          {NAV.map((item) => {
            const realId = item.id === "main" ? "top" : item.id;
            const href = onHome ? `#${realId}` : `/#${realId}`;
            return (
              <a
                key={item.id}
                href={href}
                onClick={(e) => handleNavClick(e, item.id)}
                className="hover:opacity-90"
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Копирайт */}
        <div className="sd:pb-10 xz:pb-8 pt-2 border-t border-white/10">
          <div className="flex xz:flex-col sd:flex-row items-center justify-between gap-3 text-white/60 text-xs">
            <p>© Женщина 2025</p>
            <p>
              Сайт разработан{" "}
              <a
                href="https://vi-tech.by"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white"
              >
                VI:TECH
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

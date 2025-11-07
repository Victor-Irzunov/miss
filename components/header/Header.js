"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";

/** Навигация для одностраничника */
const NAV = [
  { label: "Главная", id: "main" },
  { label: "События", id: "events" },
  { label: "Стоимость", id: "price" },
  { label: "Партнёры", id: "partners" },
  { label: "Участницы", id: "girls" },
  { label: "Организаторы", id: "organizers" },
  { label: "Контакты", id: "contacts" },
];

const DESKTOP_MEDIA = "(min-width: 1024px)";
const STORAGE_KEY = "pendingScrollTarget";

/** утилита: получить реальную высоту шапки */
function getHeaderHeight(headerRef) {
  return (
    headerRef.current?.getBoundingClientRect().height ??
    document.querySelector("header")?.getBoundingClientRect().height ??
    64
  );
}

/** точный скролл до id с учётом высоты шапки */
function scrollToId(id, headerRef, behavior = "smooth") {
  const target = document.getElementById(id === "main" ? "top" : id);
  if (!target) return false;

  const headerH = getHeaderHeight(headerRef);
  const top =
    target.getBoundingClientRect().top + window.scrollY - (headerH + 8);

  window.scrollTo({ top, behavior });
  history.replaceState?.(null, "", `#${id === "main" ? "top" : id}`);
  return true;
}

/** ретрай-скролл: ждём, пока DOM отрисуется, изображения зарендерятся и т.п. */
function retryScrollToId(id, headerRef, tries = 20, delay = 50) {
  return new Promise((resolve) => {
    const attempt = (left) => {
      // пробуем дважды в RAF для стабильной вёрстки
      requestAnimationFrame(() => {
        const ok1 = scrollToId(id, headerRef, left === tries ? "auto" : "smooth");
        if (ok1) return resolve(true);
        if (left <= 1) return resolve(false);
        setTimeout(() => attempt(left - 1), delay);
      });
    };
    attempt(tries);
  });
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const onHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const headerRef = useRef(null);

  // admin token
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

  // smooth scroll на всём документе
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";
    return () => {
      root.style.scrollBehavior = prev;
    };
  }, []);

  // десктоп/мобайл
  useEffect(() => {
    const mm = window.matchMedia(DESKTOP_MEDIA);
    const onChange = () => setIsDesktop(mm.matches);
    onChange();
    mm.addEventListener?.("change", onChange);
    return () => mm.removeEventListener?.("change", onChange);
  }, []);

  // blur логика
  useEffect(() => {
    if (!isDesktop) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY >= 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  // блокировка скролла под дровером
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  /** клики по пунктам меню */
  const handleNavClick = async (e, id) => {
    e.preventDefault();
    setOpen(false);

    if (onHome) {
      // уже на главной — скроллим сразу
      retryScrollToId(id, headerRef);
    } else {
      // на другой странице:
      // 1) сохраним намерение прокрутки
      try {
        sessionStorage.setItem(STORAGE_KEY, id);
      } catch {}
      // 2) уйдём на "/" с якорем (для SEO/UX)
      const hash = id === "main" ? "" : `#${id}`;
      router.push(`/${hash}`);
      // дальше сработает эффект ниже и докрутит точно
    }
  };

  /** клик по лого */
  const handleLogoClick = (e) => {
    if (onHome) {
      e.preventDefault();
      retryScrollToId("main", headerRef);
    } else {
      e.preventDefault();
      setOpen(false);
      try {
        sessionStorage.setItem(STORAGE_KEY, "main");
      } catch {}
      router.push("/");
    }
  };

  /** после перехода на "/", если есть hash или pendingTarget — докручиваем с ретраями */
  useEffect(() => {
    if (!onHome) return;

    let wanted = "";
    try {
      wanted = sessionStorage.getItem(STORAGE_KEY) || "";
      if (wanted) sessionStorage.removeItem(STORAGE_KEY);
    } catch {}

    if (!wanted && location.hash && location.hash.length > 1) {
      wanted = location.hash.slice(1) === "top" ? "main" : location.hash.slice(1);
    }

    if (!wanted) return;

    // небольшой таймаут, чтобы страница дорисовала секции/изображения
    const t = setTimeout(() => {
      retryScrollToId(wanted, headerRef);
    }, 50);

    return () => clearTimeout(t);
  }, [onHome]);

  return (
    <header
      ref={headerRef}
      role="banner"
      className={`
        fixed top-0 inset-x-0 z-50
        border-b border-white/10
        transition-[backdrop-filter,background-color] duration-300
        ${scrolled ? "backdrop-blur bg-black/30" : "bg-transparent"}
      `}
    >
      {/* Верхняя полоса: логотип + меню */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* ЛОГО */}
        <a
          href={onHome ? "#top" : "/"}
          onClick={handleLogoClick}
          className="flex items-center gap-3 min-w-64px xz:border-r sd:border-none border-white/10"
          aria-label="К началу страницы"
        >
          <Image
            src="/logo/logo.webp"
            alt="Академия моды Мараны Кабадарян"
            width={48}
            height={48}
            className="h-12 w-auto"
            priority
          />
          <span className="sr-only">Главная</span>
        </a>

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
            {NAV.map((item) => {
              const idForHref = item.id === "main" ? "top" : item.id;
              const href = onHome ? `#${idForHref}` : `/#${idForHref}`;
              return (
                <li
                  key={item.id}
                  className="relative px-6 h-16 flex items-center border-l border-white/10"
                >
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className="
                      uppercase text-sm
                      hover:opacity-90 focus:opacity-90
                      outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded
                    "
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
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

      {/* Бэкдроп под дровером */}
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
          <a
            href={onHome ? "#top" : "/"}
            onClick={handleLogoClick}
            className="flex items-center gap-3"
          >
            <Image
              src="/logo/logo.webp"
              alt="Академия моды Мараны Кабадарян"
              width={44}
              height={44}
              className="h-11 w-auto"
              priority
            />
          </a>
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <nav className="px-4 py-6 overflow-y-auto" role="navigation">
            <ul className="space-y-8">
              {NAV.map((item) => {
                const idForHref = item.id === "main" ? "top" : item.id;
                const href = onHome ? `#${idForHref}` : `/#${idForHref}`;
                return (
                  <li key={item.id}>
                    <a
                      href={href}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className="
                        block uppercase font-extrabold text-2xl leading-none
                        hover:opacity-90 focus:opacity-90
                        outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded
                      "
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto px-4 pb-16 border-t border-white/10">
            <div className="mt-12">
              {isAdmin ? (
                <Link
                  href="/admin/girls"
                  onClick={() => setOpen(false)}
                  className="btn btn-sm sd:btn-md btn-outline w-full text-white"
                >
                  Админ панель
                </Link>
              ) : (
                <Link
                  href="/login?from=admin"
                  onClick={() => setOpen(false)}
                  className="btn btn-sm sd:btn-md btn-neutral w-full"
                >
                  Вход
                </Link>
              )}
            </div>
          </div>
        </div>
      </aside>
    </header>
  );
}

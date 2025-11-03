"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const readToken = () => {
      try {
        const token = localStorage.getItem("token_miss");
        if (!token) return setIsAdmin(false);
        const payload = jwtDecode(token); // { email, id, isAdmin, exp? }
        const notExpired =
          typeof payload?.exp !== "number" ? true : payload.exp * 1000 > Date.now();
        setIsAdmin(Boolean(payload?.isAdmin) && notExpired);
      } catch {
        setIsAdmin(false);
      }
    };

    readToken();
    const onStorage = (e) => {
      if (e.key === "token_miss") readToken();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <footer
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
          {/* Левая колонка — большой логотип-заглушка */}
          <div className="sd:col-span-5 xz:order-2 sd:order-0">
            <div className="opacity-30 select-none">
              <Image
                src="/logo/logo.webp"
                alt="Женщина 2025"
                width={300}
                height={300}
                className=""
                priority={false}
              />
            </div>
          </div>

          {/* Правая колонка — контакты, соцсети, вход/админ */}
          <div className="sd:col-span-7 xz:order-1 sd:order-0">
            <h2 id="footer-title" className="sr-only">
              Контакты и ссылки
            </h2>

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
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="rounded-full border border-white/30 p-3 hover:bg-white/10 transition"
                >
                  <img src="/svg/facebook.svg" alt="" className="w-5 h-5" loading="lazy" />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="rounded-full border border-white/30 p-3 hover:bg-white/10 transition"
                >
                  <img src="/svg/instagram.svg" alt="" className="w-5 h-5" loading="lazy" />
                </a>
                <a
                  href="https://youtube.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="rounded-full border border-white/30 p-3 hover:bg-white/10 transition"
                >
                  <img src="/svg/youtube.svg" alt="" className="w-5 h-5" loading="lazy" />
                </a>
                <a
                  href="https://tiktok.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="rounded-full border border-white/30 p-3 hover:bg-white/10 transition"
                >
                  <img src="/svg/tiktok.svg" alt="" className="w-5 h-5" loading="lazy" />
                </a>
              </div>

              <div className="ml-auto">
                {isAdmin ? (
                  <Link href="/admin/girls" className="btn btn-sm sd:btn-md btn-accent text-white">
                    Админ панель
                  </Link>
                ) : (
                  <Link href="/login?from=admin" className="btn btn-sm sd:btn-md btn-neutral">
                    Вход
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Нижнее меню ссылок */}
        <nav
          className="grid sd:grid-cols-6 xz:grid-cols-2 gap-3 sd:gap-6 border-t border-white/10 sd:py-8 xz:py-6 text-sm font-semibold"
          aria-label="Footer navigation"
        >
          <Link className="hover:opacity-90" href="/about">Про конкурс</Link>
          <Link className="hover:opacity-90" href="/news">Новости и события</Link>
          <Link className="hover:opacity-90" href="/press">СМИ о нас</Link>
          <Link className="hover:opacity-90" href="/winners">Победительницы</Link>
          <Link className="hover:opacity-90" href="/gallery">Галерея</Link>
          <Link className="hover:opacity-90" href="/partners">Партнёры</Link>
        </nav>

        {/* Копирайт */}
        <div className="sd:pb-10 xz:pb-8 pt-2 border-t border-white/10">
          <div className="flex xz:flex-col sd:flex-row items-center justify-between gap-3 text-white/60 text-xs">
            <p>© Женщина 2025</p>
            <p>
              Сайт разработан{" "}
              <a href="https://vi-tech.by" target="_blank" rel="noreferrer" className="underline hover:text-white">
                VI:TECH
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

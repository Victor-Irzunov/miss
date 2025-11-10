"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { stripTags, truncateText, yearsWord } from "@/lib/text";
import RunningText2 from "../RunningText/RunningText2";

const CAT_LABEL = {
  PLUS35: "35+",
  PLUS50: "50+",
  PLUS60: "60+",
  ONLINE: "Онлайн",
};

const CAT_ORDER = ["PLUS35", "PLUS50", "PLUS60", "ONLINE"];

function GirlCard({ g }) {
  const imgs = Array.isArray(g.images) && g.images.length ? g.images : [g.mainImage];

  return (
    <article
      className="relative rounded-2xl border overflow-hidden shadow-xl bg-linear-to-b from-[#1b0a0a]/80 via-[#1a0a0a]/60 to-[#2c0a0a]/80 ring-1 ring-white/10"
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Верхняя декоративная кайма */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-transparent via-[#d4af37] to-transparent opacity-70" />

      {/* Фото-блок */}
      <div className="relative w-full xz:h-80 sd:h-[360px] p-4">
        <div className="relative w-full h-full">
          {/* Белая подложка под углом */}
          <div className="absolute inset-0 rounded-2xl bg-white shadow-2xl" style={{ transform: "rotate(-3deg)" }} />
          {/* Слайдер */}
          <div className="relative rounded-2xl overflow-hidden w-full h-full" style={{ transform: "rotate(-3deg)" }}>
            <div className="carousel w-full h-full">
              {imgs.map((src, idx) => (
                <div className="carousel-item w-full" key={`${src}-${idx}`}>
                  <Image
                    src={src}
                    alt={`${g.firstName} ${g.lastName}`}
                    width={900}
                    height={1200}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Золотой логомаркер */}
          <div className="absolute -right-2 -top-2">
            <div className="w-11 h-11 rounded-full bg-linear-to-br from-[#ffdf7a] via-[#d4af37] to-[#8b6b16] shadow-lg ring-2 ring-white/70 flex items-center justify-center">
              <Image src="/logo/logo-b.webp" alt="Логотип премии" width={96} height={96} className="rounded-full" priority />
            </div>
          </div>
        </div>
      </div>

      {/* НИЖНЯЯ ЧАСТЬ КАРТОЧКИ */}
      <div className="relative p-4 pt-2">
        <div className="relative -mt-10 flex items-center gap-3">
          <div className="rounded-xl sd:px-4 xz:px-3 py-2 bg-linear-to-b from-[#ffd86b] via-[#d4af37] to-[#9f7a1c] text-black font-extrabold sd:text-base xz:text-sm shadow-[0_10px_30px_rgba(212,175,55,0.35)]">
            {g.firstName?.toUpperCase()} {g.lastName?.toUpperCase()}
          </div>


        </div>

        <div className="mt-2 flex justify-between items-center gap-2">
          <div className='flex space-x-3'>
            <div className="rounded-lg sd:px-2 xz:px-1.5 py-1 bg-white/90 text-black/80 text-xs font-semibold shadow">{g.city}</div>
            <span className="ml-auto badge badge-outline badge-secondary">
              {g.age} {yearsWord(g.age)}
            </span>
          </div>
          <span className="badge badge-sm badge-outline border-white/30 text-white/90">{CAT_LABEL[g.category] || "35+"}</span>
          {g.categoryWinner && <span className="badge badge-sm bg-yellow-400 text-black font-bold">Победитель</span>}
        </div>

        <p className="line-clamp-3 text-sm mt-4 text-white/90">
          {truncateText(stripTags(g.description || ""), 180)}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href={`/girls/${g.slug}`}
            className="btn btn-sm border-0 text-white font-semibold
             bg-linear-to-r from-[#A705D0] via-[#C117E9] to-[#FF41F8]
             hover:from-[#8C00AD] hover:via-[#B60FE0] hover:to-[#FF3AEF]
             shadow-[0_8px_24px_rgba(167,5,208,0.45)]
             focus:outline-none focus:ring-2 focus:ring-offset-2
             focus:ring-[#A705D0]/60 focus:ring-offset-black"
          >
            Профиль участницы
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-white/10 text-white/95 ring-1 ring-white/20">
              Голоса:
              <span className="ml-2 inline-flex items-center justify-center rounded-md px-2 py-0.5 bg-linear-to-b from-[#ffd86b] via-[#d4af37] to-[#9f7a1c] text-black">
                {g.votesCount ?? 0}
              </span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function GirlsSection() {
  const [girls, setGirls] = useState([]);

  useEffect(() => {
    let mounted = true;
    axios
      .get("/api/girls")
      .then((r) => {
        if (!mounted) return;
        const items = r?.data?.items || [];
        setGirls(items);
      })
      .catch(() => setGirls([]));
    return () => {
      mounted = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = { PLUS35: [], PLUS50: [], PLUS60: [], ONLINE: [] };
    for (const g of girls) (map[g.category || "PLUS35"] || map.PLUS35).push(g);
    return map;
  }, [girls]);

  return (
    <section id="girls" className="relative py-16 body-fashion" itemScope itemType="https://schema.org/ItemList">
      <RunningText2 />

      {/* ======= ЛОГО СПРАВА ВВЕРХУ ======= */}
      <div className="container mx-auto">
        <div className="relative">
          <div className="absolute right-0 top-6 sd:block xz:hidden">
            <Image
              src="/logo/logo.webp"
              alt="Логотип премии"
              width={96}
              height={96}
              className="rounded-full shadow-xl ring-2 ring-white/30"
              priority
            />
          </div>
        </div>
      </div>

      {/* ======= ШАПКА ======= */}
      <div className="container mx-auto xz:mt-11 sd:mt-28">
        <div className="relative overflow-visible">
          {/* Световые пятна за текстом */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            {[
              { x: "5%", y: "20%" },
              { x: "26%", y: "8%" },
              { x: "58%", y: "18%" },
              { x: "78%", y: "28%" },
              { x: "18%", y: "66%" },
              { x: "42%", y: "58%" },
              { x: "70%", y: "64%" },
            ].map((p, i) => (
              <span
                key={i}
                className="absolute block w-28 h-28 sd:w-32 sd:h-32 rounded-[18px]"
                style={{
                  left: p.x,
                  top: p.y,
                  background:
                    "radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(255,255,255,0.3) 55%, transparent 70%)",
                  boxShadow: "0 0 18px rgba(255,255,255,0.55), inset 0 0 18px rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>

          {/* Текст без blur: градиент в заливке + чёткие тени */}
          <div className="text-center select-none">
            <p
              className="mx-auto tracking-widest uppercase sd:text-[28px] xz:text-xl font-extrabold leading-tight"
              style={{
                color: "transparent",
                backgroundImage: "linear-gradient(180deg,#e5e5e5 0%,#cfcfcf 35%,#ffffff 55%,#bfbfbf 75%,#f4f4f4 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                textShadow: "0 1px 0 rgba(0,0,0,0.45), 0 0 6px rgba(255,255,255,0.35)",
                letterSpacing: "0.06em",
                WebkitTextStroke: "0.4px rgba(255,255,255,0.35)",
              }}
            >
              ПРЕМИЯ КРАСОТЫ
            </p>

            <div className="relative inline-block">
              <span
                className="relative z-10 mt-2 font-extrabold tracking-widest uppercase sd:text-[72px] xz:text-4xl leading-[1.05] text-center"
                style={{
                  color: "transparent",
                  backgroundImage:
                    "linear-gradient(180deg,#f3f3f3 0%, #d9d9d9 30%, #ffffff 55%, #c8c8c8 78%, #fafafa 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  textShadow: "0 1px 0 rgba(0,0,0,0.5), 0 0 4px rgba(255,255,255,0.25)",
                  WebkitTextStroke: "0.6px rgba(255,255,255,0.45)",
                }}
              >
                ЖЕНЩИНА 2025
              </span>

              <span
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-35"
                style={{
                  filter: "blur(2px)",
                  background: "linear-gradient(180deg,transparent 0%,rgba(255,255,255,0.9) 50%,transparent 100%)",
                  WebkitMaskImage: "linear-gradient(180deg,transparent 0%,black 40%,black 60%,transparent 100%)",
                  maskImage: "linear-gradient(180deg,transparent 0%,black 40%,black 60%,transparent 100%)",
                }}
              />
            </div>

            <p className="text-center text-base text-white/80 mt-4">
              Знакомьтесь с участницами. Нажмите на карточку, чтобы открыть страницу девушки.
            </p>
          </div>
        </div>
      </div>

      {/* ======= СЕКЦИИ ПО КАТЕГОРИЯМ ======= */}
      {CAT_ORDER.map((catKey) => {
        const arr = grouped[catKey] || [];
        if (!arr.length) return null;

        return (
          <div key={catKey} className="container mx-auto sd:py-10 xz:py-8 mt-8">
            <h2 className="text-2xl sd:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 px-3">
                {CAT_LABEL[catKey]}
              </span>
              <span>Категория «{CAT_LABEL[catKey]}»</span>
            </h2>

            <div className="grid sd:grid-cols-3 xz:grid-cols-1 gap-6 mt-6">
              {arr.map((g, i) => (
                <GirlCard key={g.slug || `${catKey}-${i}`} g={g} />
              ))}
            </div>

            {/* JSON-LD для секции */}
            <script
              type="application/ld+json"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  name: `Участницы — ${CAT_LABEL[catKey]}`,
                  itemListElement: arr.map((g, idx) => ({
                    "@type": "Person",
                    position: idx + 1,
                    name: `${g.firstName} ${g.lastName}`,
                    homeLocation: g.city,
                    url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/girls/${g.slug}`,
                    image: g.mainImage,
                    description: stripTags(g.description || ""),
                  })),
                }),
              }}
            />
          </div>
        );
      })}
    </section>
  );
}

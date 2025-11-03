// /components/Girls/GirlsSection.jsx — фиксируем карусель в карточках (DaisyUI), одинаковая высота, без изменения остальной логики
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { stripTags, truncateText, yearsWord } from "@/lib/text";
import RunningText2 from "../RunningText/RunningText2";

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

  const list = useMemo(() => girls, [girls]);

  return (<section id="girls" className="" itemScope itemType="https://schema.org/ItemList"> <RunningText2 />

    ```
    <div className="container mx-auto sd:py-16 xz:py-8">
      <h2 className="text-center font-extrabold tracking-tight text-white sd:text-4xl xz:text-2xl">
        Участницы «Женщина 2025»
      </h2>
      <p className="text-center text-base text-muted-foreground mt-2">
        Знакомьтесь с участницами. Нажмите на карточку, чтобы открыть страницу девушки.
      </p>

      <div className="grid sd:grid-cols-3 xz:grid-cols-1 gap-6 mt-8">
        {list.map((g, i) => {
          const imgs = Array.isArray(g.images) && g.images.length ? g.images : [g.mainImage];
          const baseId = (g.slug || `girl-${i}`).replace(/[^a-z0-9\-]/gi, "");

          return (
            <article
              key={g.slug || i}
              className="card bg-base-100 shadow-sm border rounded-2xl overflow-hidden"
              itemScope
              itemType="https://schema.org/Person"
            >
              {/* === Карусель DaisyUI с якорями (❮ / ❯), фиксированная высота во всех карточках === */}
              <div className="relative w-full xz:h-80 sd:h-[360px]">
                <div className="carousel w-full h-full">
                  {imgs.map((src, idx) => {
                    const prev = (idx - 1 + imgs.length) % imgs.length;
                    const next = (idx + 1) % imgs.length;
                    return (
                      <div
                        id={`${baseId}-slide-${idx}`}
                        className="carousel-item relative w-full"
                        key={`${src}-${idx}`}
                      >
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
                    );
                  })}
                </div>
              </div>

              {/* === Контент карточки === */}
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-amber-400/80 flex items-center justify-center text-white font-bold">
                    W
                  </div>
                  <span className="badge badge-outline">
                    {g.age} {yearsWord(g.age)}
                  </span>
                </div>

                <h3 className="card-title mt-2 text-xl" itemProp="name">
                  {g.firstName} {g.lastName}
                </h3>
                <p className="text-sm text-muted-foreground" itemProp="homeLocation">
                  {g.city}
                </p>

                {/* Сниппет без HTML-тегов */}
                <p className="line-clamp-3 text-sm mt-2">
                  {truncateText(stripTags(g.description || ""), 180)}
                </p>

                <div className="card-actions mt-3">
                  <Link href={`/girls/${g.slug}`} className="btn btn-primary btn-sm w-full">
                    Профиль участницы
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* JSON-LD AEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: list.map((g, idx) => ({
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
  </section>

  );
}

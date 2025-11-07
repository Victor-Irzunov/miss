"use client";

import Image from "next/image";

export default function EventHero() {
  const IMG_DESKTOP = "/fon/fon1.webp";
  const IMG_MOBILE = "/fon/fon1-mobile.webp";

  return (
    <section aria-label="Анонс мероприятия" className="w-full relative" id='events'>
      <div className="container mx-auto sd:px-0 xz:px-3">
        <div className="grid sd:grid-cols-2 gap-0 border rounded-3xl overflow-hidden sd:py-3.5 xz:py-0 sd:px-3.5 xz:px-0 border-white/10 bg-white/5">
          <div className="relative h-[48vh] sd:h-[72vh] rounded-3xl overflow-hidden">
            <Image
              src={IMG_DESKTOP}
              alt="Премия красоты — финал"
              fill
              priority
              className="hidden sd:block object-cover"
              sizes="(min-width: 992px) 50vw, 0px"
            />
            <Image
              src={IMG_MOBILE}
              alt="Премия красоты — финал"
              fill
              priority
              className="sd:hidden object-cover"
              sizes="(max-width: 991px) 100vw, 0px"
            />
            <div className="pointer-events-none absolute inset-0 sd:bg-linear-to-r sd:from-transparent sd:to-black/15" />
          </div>

          <div className="relative text-white p-6 lg:p-12 flex items-center body-fashion">
            <div className="w-full">
              <div className="text-right sd:text-left">
                <div className="text-xl sd:text-2xl tracking-wide font-semibold">
                  16 НОЯБРЯ 2025 Г.
                </div>
                <div className="mt-2 text-base sd:text-lg opacity-90">отель «Ренессанс»</div>
              </div>

              <h2
                className="mt-6 text-center sd:text-left text-5xl sd:text-6xl font-extrabold tracking-tight h-fashion"
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
                ПРОЙДЕТ
              </h2>

              <p
                className="mt-4 text-xl sd:text-xl sd:text-left xz:text-center"
                 style={{
                  color: "transparent",
                  backgroundImage:
                    "linear-gradient(180deg,#e5e5e5 0%,#cfcfcf 35%,#ffffff 55%,#bfbfbf 75%,#f4f4f4 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  textShadow: "0 1px 0 rgba(0,0,0,0.45), 0 0 6px rgba(255,255,255,0.35)",
                  letterSpacing: "0.06em",
                  WebkitTextStroke: "0.4px rgba(255,255,255,0.35)",
                }}
              >
                1-я Премия красоты «Женщина 2025»
              </p>

              <div className="mt-5 space-y-3 text-base leading-relaxed max-w-prose">
                <p>
                  На финале Премии красоты Женщины Беларуси представляют себя и свою
                  уникальность перед зрителями и жюри.
                </p>
              </div>

              <div className="mt-8">
                <a
                  href="#girls"
                  className="btn btn-primary sd:w-auto xz:w-full btn-lg rounded-2xl shadow-[0_10px_40px_rgba(167,5,208,0.35)]"
                >
                  Смотреть участниц
                </a>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl opacity-25 bg-fuchsia-500/30" />
              <div className="absolute bottom-0 left-10 w-56 h-56 rounded-full blur-3xl opacity-25 bg-sky-500/25" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

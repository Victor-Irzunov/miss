// /components/Sections/TrustInvite.jsx — адаптивная секция: desktop без изменений; mobile — усилено затемнение фона для читаемости текста
"use client";

import Image from "next/image";

export default function TrustInvite() {
  const BG_DESKTOP = "/fon/fon-white.webp";
  const BG_MOBILE = "/fon/fon-white-mobile.webp";
  const IMG_QUEEN = "/fon/queen.webp";

  return (
    <section aria-label="Fashion-мероприятия — доверие и приглашение" className="relative w-full overflow-hidden body-fashion">
      <div className="container mx-auto sd:px-0 xz:px-3">
        {/* ===== MOBILE (усилено затемнение) ===== */}
        <div className="relative sd:hidden rounded-3xl overflow-hidden border border-white/10">
          <Image src={IMG_QUEEN} alt="" fill priority className="object-cover" sizes="100vw" />
          {/* базовый градиент-затенение */}
          <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/45 to-black/30" />
          {/* мягкое белое «вуаль»-перекрытие для кожи/светлых участков */}
          <div className="absolute inset-0 pointer-events-none bg-white/5 mix-blend-overlay" />
          {/* фон-узор поверх, чуть слабее */}
          <div className="absolute inset-0">
            <Image src={BG_MOBILE} alt="" fill className="object-cover mix-blend-overlay opacity-70" />
          </div>

          <div className="absolute right-3 top-3 z-10">
            <Image src="/logo/logo-b.webp" alt="Академия моды Марины Кабадарян" width={96} height={96} className="h-12 w-auto object-contain" />
          </div>

          <div className="relative z-10 p-4">
            <p
              className="tracking-widest uppercase xz:text-lg font-extrabold leading-tight body-fashion"
              style={{
                color: "transparent",
                backgroundImage: "linear-gradient(180deg,#e5e5e5 0%,#cfcfcf 35%,#ffffff 55%,#bfbfbf 75%,#f4f4f4 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                textShadow: "0 1px 0 rgba(0,0,0,0.55), 0 0 6px rgba(255,255,255,0.35)",
                letterSpacing: "0.06em",
                WebkitTextStroke: "0.4px rgba(255,255,255,0.45)",
              }}
            >
              FASHION-МЕРОПРИЯТИЯ МАРИНЫ КАБАДАРЯН
            </p>

            <div className="relative inline-block mt-2 h-fashion">
              <span
                className="relative z-10 font-extrabold tracking-widest uppercase xz:text-4xl leading-[1.05] text-left block"
                style={{
                  color: "transparent",
                  backgroundImage: "linear-gradient(180deg,#f3f3f3 0%, #d9d9d9 30%, #ffffff 55%, #c8c8c8 78%, #fafafa 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  textShadow: "0 1px 0 rgba(0,0,0,0.6), 0 0 4px rgba(255,255,255,0.25)",
                  WebkitTextStroke: "0.6px rgba(255,255,255,0.55)",
                }}
              >
                ЗАВОЕВАЛИ ДОВЕРИЕ
              </span>
              <span
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  filter: "blur(2px)",
                  background: "linear-gradient(180deg,transparent 0%,rgba(255,255,255,0.95) 50%,transparent 100%)",
                  WebkitMaskImage: "linear-gradient(180deg,transparent 0%,black 40%,black 60%,transparent 100%)",
                  maskImage: "linear-gradient(180deg,transparent 0%,black 40%,black 60%,transparent 100%)",
                }}
              />
            </div>

            <div className="mt-4 text-white/95 text-base leading-relaxed">
              <p>Многие женщины Минска и других городов Республики Беларусь доверяют нам организацию модных событий и праздников.</p>
              <p className="mt-3">Целевая аудитория — женщины, любящие моду и красоту, достойные самого лучшего подарка для себя.</p>
            </div>

            <div className="mt-6 rounded-2xl p-4 bg-linear-to-b from-[#9b1c1c] via-[#7c1010] to-[#4a0a0a] text-white shadow-[0_10px_40px_rgba(124,16,16,0.35)]">
              <div className="text-2xl font-extrabold tracking-tight">ПРИГЛАШАЕМ</div>
              <p className="mt-2 text-sm opacity-95">Разделить этот день с нами и стать партнёром мероприятия.</p>
            </div>
          </div>
        </div>

        {/* ===== DESKTOP (без изменений) ===== */}
        <div className="hidden sd:grid grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-white/10">
          <div className="relative bg-white/40">
            <Image src={BG_DESKTOP} alt="" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-white/65" />
            <div className="relative z-10  p-10">
              <p
                className="tracking-widest uppercase sd:text-[28px] font-extrabold leading-tight"
                style={{
                  color: "transparent",
                  backgroundImage: "linear-gradient(180deg,#1f2937 0%,#111827 35%,#111111 55%,#0b0b0b 75%,#1f2937 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  textShadow: "0 1px 0 rgba(0,0,0,0.25), 0 0 6px rgba(255,255,255,0.25)",
                  letterSpacing: "0.06em",
                  WebkitTextStroke: "0.3px rgba(0,0,0,0.2)",
                }}
              >
                FASHION-МЕРОПРИЯТИЯ МАРИНЫ КАБАДАРЯН
              </p>

              <div className="relative inline-block mt-2">
                <span
                  className="relative z-10 font-extrabold tracking-widest uppercase sd:text-[72px] leading-[1.05] text-left block"
                  style={{
                    color: "transparent",
                    backgroundImage: "linear-gradient(180deg,#f3f3f3 0%, #d9d9d9 30%, #ffffff 55%, #c8c8c8 78%, #fafafa 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    textShadow: "0 1px 0 rgba(0,0,0,0.5), 0 0 4px rgba(255,255,255,0.25)",
                    WebkitTextStroke: "0.6px rgba(255,255,255,0.45)",
                  }}
                >
                  ЗАВОЕВАЛИ ДОВЕРИЕ
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

              <div className="mt-6 text-lg leading-relaxed max-w-[44ch] text-black">
                <p className="text-black">Многие женщины Минска и других городов Республики Беларусь доверяют нам организацию модных событий и праздников.</p>
                <p className="mt-4">Целевая аудитория — женщины, которые любят моду и красоту, достойные самого лучшего подарка для себя.</p>
              </div>

              <div className="mt-10 rounded-3xl p-8 bg-linear-to-b from-[#9b1c1c] via-[#7c1010] to-[#4a0a0a] text-white shadow-[0_10px_40px_rgba(124,16,16,0.35)] max-w-152">
                <div className="text-4xl font-extrabold tracking-tight">ПРИГЛАШАЕМ</div>
                <p className="mt-2 opacity-95">Разделить этот день с нами и стать партнёром мероприятия.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image src={IMG_QUEEN} alt="" fill className="object-cover" sizes="50vw" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-white/95 via-white/5 to-transparent" />
            <div className="absolute right-4 top-4 z-10">
              <Image src="/logo/logo-b.webp" alt="Академия моды Марины Кабадарян" width={120} height={120} className="h-20 w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

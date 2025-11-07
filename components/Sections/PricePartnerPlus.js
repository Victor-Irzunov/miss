// /components/Sections/PricePartnerPlus.jsx — секция «Стоимость участия — Пакет ПАРТНЁР+» с фоном и чёрным логотипом
"use client";

import Image from "next/image";

export default function PricePartnerPlus() {
  const BG_DESKTOP = "/fon/fon-white.webp";
  const BG_MOBILE  = "/fon/fon-white-mobile.webp";
  const LOGO_BLACK = "/logo/logo-b.webp";

  return (
    <section aria-label="Стоимость участия — пакет Партнёр+" className="relative w-full overflow-hidden body-fashion">
      {/* ФОН */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={BG_DESKTOP}
          alt=""
          fill
          priority
          className="hidden sd:block object-cover"
          sizes="(min-width: 992px) 100vw, 0px"
        />
        <Image
          src={BG_MOBILE}
          alt=""
          fill
          priority
          className="sd:hidden object-cover"
          sizes="(max-width: 991px) 100vw, 0px"
        />
      </div>

      <div className="container mx-auto sd:px-0 xz:px-3 sd:py-16 xz:py-10">
        <div className="relative rounded-3xl bg-white/85 backdrop-blur-sm border border-black/10 shadow-xl">
          {/* ЧЁРНЫЙ ЛОГО ВВЕРХУ */}
          <div className="absolute sd:top-6 sd:left-6 xz:top-0 xz:left-0">
            <Image
              src={LOGO_BLACK}
              alt="Академия моды Марины Кабадарян"
              width={120}
              height={120}
              className="h-10 w-auto sd:h-14 object-contain"
              priority
            />
          </div>

          {/* ВЕРТИКАЛЬНЫЙ БЕЙДЖ */}
          <div className="absolute top-0 left-0 h-full w-0 sd:w-52 xz:hidden sd:flex">
            <div className="ml-6 my-6 w-40 text-3xl rounded-2xl bg-[#7c0c0f] text-white shadow-[0_10px_40px_rgba(124,12,15,.35)] flex items-center justify-center px-4">
              <div className="rotate-180 [writing-mode:vertical-rl] tracking-widest uppercase font-semibold">
                Пакет «Партнёр+»
              </div>
            </div>
          </div>

          {/* КОНТЕНТ */}
          <div className="sd:pl-72 xz:pl-5 xz:pr-5 sd:pr-10 sd:py-14 xz:py-8">
            <h2 className="text-center sd:text-4xl xz:text-2xl font-semibold tracking-wide text-neutral-900 h-fashion">
              СТОИМОСТЬ УЧАСТИЯ В ПРЕМИЯ КРАСОТЫ
            </h2>

            <div className="mt-6 grid sd:grid-cols-[auto,1fr] items-start gap-6">
              <div className="text-[#7c0c0f] sd:text-[64px] xz:text-[40px] leading-none font-semibold">
                2&nbsp;000&nbsp;BYN
              </div>
              <p className="text-neutral-700 sd:text-base xz:text-sm">
                + подарки каждой победительнице премии красоты «Женщина 2025», а также
                возможность раздать скидки для наших приглашённых женщин.
              </p>
            </div>

            {/* ИНФОПОВОД */}
            <div className="mt-8">
              <h3 className="font-semibold sd:text-lg xz:text-base text-neutral-900">
                СОЗДАНИЕ ИНФОРМАЦИОННОГО ПОВОДА:
              </h3>
              <ul className="mt-3 sd:text-base xz:text-sm text-neutral-800 space-y-2">
                <li>• упоминание компании в период организации и проведения проекта (2 месяца: ноябрь/декабрь 2025 года) в социальных сетях организаторов проекта и информационного партнёра;</li>
                <li>• отчётные фото- и видеоматериалы мероприятия.</li>
              </ul>
            </div>

            {/* ВОЗМОЖНОСТИ И БОНУСЫ */}
            <div className="mt-8 space-y-6">
              <div>
                <h4 className="font-semibold text-neutral-900 sd:text-base xz:text-sm">
                  Возможность рекламы продукта/услуги компании
                </h4>
                <p className="mt-2 text-neutral-800 sd:text-base xz:text-sm">
                  Баннеры, промопродукция, визитки бренда и т.п.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 sd:text-base xz:text-sm">
                  Пригласительные билеты
                </h4>
                <p className="mt-2 text-neutral-800 sd:text-base xz:text-sm">
                  На конкурс красоты — 5 шт.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 sd:text-base xz:text-sm">
                  Предоставление билетов со скидкой 50%
                </h4>
                <p className="mt-2 text-neutral-800 sd:text-base xz:text-sm">
                  В количестве 10 шт.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 sd:text-base xz:text-sm">Нетворкинг</h4>
                <p className="mt-2 text-neutral-800 sd:text-base xz:text-sm">
                  Полезные знакомства на конкурсе красоты.
                </p>
              </div>

              {/* Доп. блок */}
              <div className="pt-4 border-t border-black/10">
                <h4 className="font-semibold text-[#7c0c0f] sd:text-base xz:text-sm uppercase">
                  А также вы получите:
                </h4>
                <ul className="mt-2 sd:text-base xz:text-sm text-neutral-800 space-y-1">
                  <li>✓ Подарок — ролик рилс с мероприятия и публикация дополнительного партнёрского поста.</li>
                  <li>✓ Возможность выступить со сцены до 2 мин, представляя компанию.</li>
                </ul>
              </div>
            </div>

            {/* МОБИЛЬНЫЙ БЕЙДЖ */}
            <div className="sd:hidden mt-10">
              <div className="w-full rounded-2xl bg-[#7c0c0f] text-white py-3 text-center font-semibold tracking-wide uppercase">
                Пакет «Партнёр+»
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

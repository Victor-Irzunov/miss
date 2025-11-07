// /components/Sections/PriceGeneralPartner.jsx — секция «Стоимость участия» с фоном и чёрным логотипом
"use client";

import Image from "next/image";

export default function PriceGeneralPartner() {
  // Фон (десктоп/мобайл)
  const BG_DESKTOP = "/fon/fon-white.webp";
  const BG_MOBILE = "/fon/fon-white-mobile.webp";

  // Чёрный логотип
  const LOGO_BLACK = "/logo/logo-b.webp";

  return (
    <section
      aria-label="Стоимость участия в премии красоты"
      className="relative w-full overflow-hidden body-fashion"
      id="price"
    >
      {/* === ФОНОВОЕ ИЗОБРАЖЕНИЕ (под всем контентом) === */}
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

      <div className="container mx-auto sd:px-0 xz:px-3 sd:py-28 xz:py-24">
        {/* Карточка контента */}
        <div className="relative rounded-3xl bg-white/85 backdrop-blur-sm border border-black/10 shadow-xl">
          {/* Логотип (чёрный) вверху слева */}
          <div className="absolute sd:top-4 sd:left-4 xz:top-0 xz:left-0">
            <Image
              src={LOGO_BLACK}
              alt="Академия моды Марины Кабадарян"
              width={120}
              height={120}
              className="h-10 w-auto sd:h-14 object-contain"
              priority
            />
          </div>

          {/* ВЕРТИКАЛЬНЫЙ БЭДЖ СЛЕВА */}
          <div className="absolute top-0 left-0 h-full w-0 sd:w-52 xz:hidden sd:flex">
            <div className="ml-6 my-6 w-40 text-3xl rounded-2xl bg-[#7c0c0f] text-white shadow-[0_10px_40px_rgba(124,12,15,.35)] flex items-center justify-center px-4">
              <div className="rotate-180 [writing-mode:vertical-rl] tracking-widest uppercase font-semibold">
                Пакет «Генеральный партнёр»
              </div>
            </div>
          </div>

          {/* Контент */}
          <div className="sd:pl-72 xz:pl-5 xz:pr-5 sd:pr-10 sd:py-14 xz:py-8">
            {/* Заголовок */}
            <h2 className="text-center sd:text-4xl xz:text-2xl font-semibold tracking-wide text-neutral-900 h-fashion">
              СТОИМОСТЬ УЧАСТИЯ В ПРЕМИЯ КРАСОТЫ
            </h2>

            {/* Цена + краткое примечание */}
            <div className="mt-6 grid sd:grid-cols-[auto,1fr] items-start gap-6">
              <div className="text-[#7c0c0f] sd:text-[64px] xz:text-[40px] leading-none font-semibold">
                4 750 BYN
              </div>
              <p className="text-neutral-700 sd:text-base xz:text-sm">
                + подарки каждой победительнице премии красоты «Женщина 2025»,
                а также возможность раздать скидки для наших приглашённых женщин.
              </p>
            </div>

            {/* Раздел: Создание инфоповода */}
            <div className="mt-8">
              <h3 className="font-semibold sd:text-lg xz:text-base text-neutral-900">
                СОЗДАНИЕ ИНФОРМАЦИОННОГО ПОВОДА:
              </h3>
              <ul className="mt-3 sd:text-base xz:text-sm text-neutral-800 space-y-2">
                <li>• размещение афиши и пресс-релиза на порталах инфопартнёров;</li>
                <li>
                  • упоминание компании в контенте генерального информационного партнёра;
                </li>
                <li>• размещение логотипа компании на афишах и рекламных макетах;</li>
                <li>
                  • упоминания в соцсетях организаторов проекта и инфопартнёра (2 месяца);
                </li>
                <li>• отчётные фото- и видеоматериалы мероприятия.</li>
              </ul>
            </div>

            {/* Блоки возможностей (примерная структура из макета) */}
            <div className="mt-8 grid sd:grid-cols-2 xz:grid-cols-1 gap-6">
              <div>
                <h4 className="font-semibold text-neutral-900 sd:text-base xz:text-sm">
                  Возможность рекламы
                </h4>
                <p className="mt-2 text-neutral-800 sd:text-base xz:text-sm">
                  Баннеры, промопродукция, визитки бренда и т.п.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 sd:text-base xz:text-sm">
                  Возможность дать интервью
                </h4>
                <p className="mt-2 text-neutral-800 sd:text-base xz:text-sm">
                  Для Europa TV в рамках конкурса красоты.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 sd:text-base xz:text-sm">
                  Локация в пространстве конкурса
                </h4>
                <p className="mt-2 text-neutral-800 sd:text-base xz:text-sm">
                  Брендированная фотозона и устная презентация компании.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 sd:text-base xz:text-sm">
                  Представитель в жюри
                </h4>
                <p className="mt-2 text-neutral-800 sd:text-base xz:text-sm">
                  1 представитель вашей компании становится членом жюри.
                </p>
              </div>
            </div>

            {/* Билеты */}
            <div className="mt-8 grid sd:grid-cols-2 xz:grid-cols-1 gap-6">
              <div>
                <h4 className="font-semibold text-neutral-900 sd:text-base xz:text-sm">
                  Пригласительные билеты
                </h4>
                <p className="mt-2 text-neutral-800 sd:text-base xz:text-sm">
                  На премию красоты (4 шт.).
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 sd:text-base xz:text-sm">
                  Билеты со скидкой
                </h4>
                <p className="mt-2 text-neutral-800 sd:text-base xz:text-sm">
                  Скидка 50% — в количестве 10 шт.
                </p>
              </div>
            </div>

            {/* Мобильная полоска-пакет (дубль вертикального бэджа) */}
            <div className="sd:hidden mt-8">
              <div className="w-full rounded-2xl bg-[#7c0c0f] text-white py-3 text-center font-semibold tracking-wide uppercase">
                Пакет «Генеральный партнёр»
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

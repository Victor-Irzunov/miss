// /components/Sections/AudienceOpportunities.jsx — убраны белые полосы по краям (убрал бордер и дал «безшовный» фон)
"use client";

import Image from "next/image";

export default function AudienceOpportunities() {
const BG_DESKTOP = "/fon/fon-white.webp";
const BG_MOBILE = "/fon/fon-white-mobile.webp";
const LOGO = "/logo/logo.webp";
const DIAMOND = "/fon/diamond.webp";

return (
<section aria-label="Участники премии и возможности для компаний" className="relative w-full overflow-hidden my-20 body-fashion" >
<div className="container mx-auto relative z-0 rounded-3xl overflow-hidden">
{/* ФОН — растянут без зазоров */}
<div className="absolute inset-0 pointer-events-none">
<Image src={BG_DESKTOP} alt="" fill priority className="hidden sd:block object-cover" sizes="(min-width: 992px) 100vw, 0px" />
<Image src={BG_MOBILE} alt="" fill priority className="sd:hidden object-cover" sizes="(max-width: 991px) 100vw, 0px" />
</div>

    {/* ВАЖНО: убрал border у блока, чтобы не было светлой рамки */}
    <div className="grid sd:grid-cols-2 xz:grid-cols-1 gap-0">
      {/* ЛЕВАЯ КОЛОНКА */}
      <div className="px-6 sd:px-10 py-8 sd:py-12 w-full z-30">
        <h2 className="font-semibold leading-tight w-full sd:text-[44px] xz:text-[30px] tracking-tight text-neutral-900">
          УЧАСТНИКИ
          <br />
          ПРЕМИИ
          <br />
          И ЗРИТЕЛИ
        </h2>

        <ul className="mt-8 space-y-6 sd:text-xl xz:text-base text-neutral-800 w-full">
          <li>
            Женщины возраста 30+,
            <br />
            которые интересуются
            <br />
            модой и красотой
          </li>
          <li>
            Блогеры, инфлюенсеры,
            <br />
            лидеры мнений,
            <br />
            представители СМИ
          </li>
          <li>Партнёры и спонсоры</li>
        </ul>

        <div className="mt-10">
          <div className="sd:text-[44px] xz:text-[28px] font-semibold tracking-wide text-[#8a0b0f]">
            &gt; 300 ЧЕЛ
          </div>
          <div className="mt-1 text-neutral-600 xz:text-sm sd:text-base">
            Общее количество участников
          </div>
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА */}
      <div className="relative">
        {/* Градиент: без рамок, лежит под текстом */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="hidden sd:block absolute inset-0 bg-linear-to-l from-[#6d0a0a]/72 via-[#6d0a0a]/45 to-transparent" />
          <div className="sd:hidden absolute inset-0 bg-linear-to-t from-[#6d0a0a]/70 via-[#6d0a0a]/40 to-transparent" />
        </div>

        <div className="relative px-6 sd:px-10 py-8 sd:py-12 text-white">
          <div className="flex space-x-3">
            <div className="-ml-3">
              <Image
                src={LOGO}
                alt="Академия моды Марины Кабадарян"
                width={140}
                height={140}
                className="h-16 w-auto sd:h-20 object-contain"
                priority
              />
            </div>
            <h3 className="sd:text-[40px] xz:text-[24px] font-semibold leading-tight tracking-tight drop-shadow">
              ВОЗМОЖНОСТИ
              <br />
              ДЛЯ ВАШЕЙ
              <br />
              КОМПАНИИ
            </h3>
          </div>

          <ul className="mt-8 space-y-6 sd:text-xl xz:text-base">
            <li className="leading-relaxed flex space-x-5 items-center">
              <Image src={DIAMOND} alt="" width={40} height={24} className="opacity-90" />
              Укрепление имиджа-компании
              <br />
              среди целевой аудитории
            </li>
            <li className="leading-relaxed flex space-x-5 items-center">
              <Image src={DIAMOND} alt="" width={40} height={24} className="opacity-90" />
              Представление
              <br />
              ваших продуктов и услуг
            </li>
            <li className="leading-relaxed flex space-x-5 items-center">
              <Image src={DIAMOND} alt="" width={40} height={24} className="opacity-90" />
              Позиционирование компании
              <br />
              как лидера в сфере поддержки
              <br />
              женщин Беларуси
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>


);
}
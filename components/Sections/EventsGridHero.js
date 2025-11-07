// /components/Sections/EventsGridHero.jsx
"use client";

import Image from "next/image";

export default function EventsGridHero() {
  const IMG_DESKTOP = "/fon/foto.webp";
  const IMG_MOBILE = "/fon/foto-mobile.webp";
  const TOP_IMG_1 = "/fon/premia-title.webp";
  const TOP_IMG_2 = "/logo/logo.webp";

  return (
    <section className="w-full relative my-20">
      <div className="container mx-auto sd:px-0 xz:px-3 rounded-3xl overflow-hidden">
        <div className="w-full bg-black rounded-t-3xl overflow-hidden">
          <div className="px-4 sd:px-6 py-6">
            <div className="flex items-start justify-center sd:items-center gap-3 sd:gap-6">
              <Image
                src={TOP_IMG_1}
                alt="Премия красоты Женщина"
                width={520}
                height={120}
                className="xz:h-10 sd:h-16 w-auto object-contain"
                priority
              />
              <Image
                src={TOP_IMG_2}
                alt="Академия моды Марины Кабадарян"
                width={140}
                height={140}
                className="xz:h-10 sd:h-16 w-auto object-contain"
                priority
              />
              <h2 className="text-white tracking-widest uppercase xz:text-lg sd:text-3xl font-extrabold">
                Наши мероприятия
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-black">
          <Image
            src={IMG_DESKTOP}
            alt="Наши мероприятия — коллаж"
            width={2400}
            height={1500}
            sizes="100vw"
            className="hidden sd:block w-full h-auto object-cover"
            priority
          />
          <Image
            src={IMG_MOBILE}
            alt="Наши мероприятия — коллаж"
            width={900}
            height={1700}
            sizes="100vw"
            className="sd:hidden w-full h-auto object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

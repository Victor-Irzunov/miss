// /components/Sections/GoalsSupport.jsx
"use client";

import Image from "next/image";

export default function GoalsSupport() {
  const BG_DESKTOP = "/fon/fon-white.webp";
  const BG_MOBILE = "/fon/fon-white-mobile.webp";

  return (
    <section aria-label="Цели и поддержка мероприятия" className="relative w-full my-20" id='purposes'>
      <div className="absolute inset-0 z-0">
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

      <div className="relative z-10 container mx-auto sd:px-0 xz:px-3 py-16 sd:py-28 body-fashion">
        <div className="rounded-3xl border border-black/5 bg-white/10 backdrop-blur-md shadow-xl p-6 sd:p-10">
          <div className="grid sd:grid-cols-2 gap-8 sd:gap-12 text-neutral-900">
            <div>
              <h2 className="tracking-widest uppercase sd:text-[28px] xz:text-xl font-extrabold leading-tight">
                ЦЕЛИ МЕРОПРИЯТИЯ
              </h2>
              <div className="mt-4 text-base sd:text-lg leading-relaxed">
                Премия проводится в целях выявления талантливых женщин и создания условий
                для поддержки и развития их профессионального уровня.
              </div>
            </div>

            <div>
              <div className="relative inline-block">
                <span className="relative z-10 mt-2 font-extrabold tracking-widest uppercase sd:text-[48px] xz:text-2xl leading-[1.1]">
                  МЕРОПРИЯТИЕ ПРИ ПОДДЕРЖКЕ
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    filter: "blur(2px)",
                    background:
                      "linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.15) 50%,transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(180deg,transparent 0%,black 40%,black 60%,transparent 100%)",
                    maskImage:
                      "linear-gradient(180deg,transparent 0%,black 40%,black 60%,transparent 100%)",
                  }}
                />
              </div>

              <ul className="mt-4 space-y-2 text-base sd:text-lg leading-relaxed">
                <li>Академии моды Марины Кабадарян</li>
                <li>Агенство моды и развития MK style</li>
                <li>
                  <p className="font-semibold">Информационная поддержка:</p>
                  <p className="">ТНТ International</p>
                 
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sd:mt-10 flex flex-wrap items-center gap-5 sd:gap-8">
            <Image
              src="/logo/logo-b.webp"
              alt="Академия моды Марины Кабадарян"
              width={96}
              height={96}
              className="h-20 w-auto sd:h-28 object-contain"
            />
           
          </div>
        </div>
      </div>
    </section>
  );
}

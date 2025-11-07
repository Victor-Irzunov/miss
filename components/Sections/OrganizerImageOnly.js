// /components/Sections/OrganizerImageOnly.jsx — секция с одним изображением (desktop + mobile), без текста
"use client";

import Image from "next/image";

export default function OrganizerImageOnly() {
// Положи файлы в /public/fon
const IMG_DESKTOP = "/fon/section-3.webp";
const IMG_MOBILE = "/fon/section-3-mobile.webp";

return (
<section aria-label="Изображение: организатор проекта" className="relative w-full">
<div className="container mx-auto my-9">
<div className="relative rounded-3xl overflow-hidden border border-black/5 shadow-sm">
{/* Desktop */}
<Image src={IMG_DESKTOP} alt="Организатор проекта — баннер" fill priority className="hidden sd:block object-cover" sizes="(min-width: 992px) 100vw, 0px" />

      {/* Mobile */}
      <Image
        src={IMG_MOBILE}
        alt="Организатор проекта — баннер"
        fill
        priority
        className="sd:hidden object-cover"
        sizes="(max-width: 991px) 100vw, 0px"
      />

      {/* Фиксатор высоты (чтобы блок не схлопывался до загрузки) */}
      <div className="sd:min-h-[90vh] xz:min-h-[45vh]" />
    </div>
  </div>
</section>


);
}
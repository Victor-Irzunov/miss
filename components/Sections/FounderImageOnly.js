// /components/Sections/FounderImageOnly.jsx — секция с одним изображением (desktop + mobile), без текста
"use client";

import Image from "next/image";

export default function FounderImageOnly() {
	const IMG_DESKTOP = "/fon/section-2.webp";
	const IMG_MOBILE = "/fon/section-2-mobile.webp";

	return (
		<section
			aria-label="Изображение: основатель премии"
			className="relative w-full"
			id="organizers"
		>
			<div className="container mx-auto my-9">
				<div className="relative rounded-3xl overflow-hidden border border-black/5 shadow-sm">
					{/* Desktop */}
					<Image src={IMG_DESKTOP} alt="Основатель премии красоты — баннер" fill priority className="hidden sd:block object-cover" sizes="(min-width: 992px) 100vw, 0px" />

					{/* Mobile */}
					<Image
						src={IMG_MOBILE}
						alt="Основатель премии красоты — баннер"
						fill
						priority
						className="sd:hidden"
						sizes="(max-width: 991px) 100vw, 0px"
					/>

					<div className="sd:min-h-[90vh] xz:min-h-[45vh]" />
				</div>
			</div>
		</section>
	);
}
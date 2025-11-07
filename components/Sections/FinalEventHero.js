// /components/Sections/FinalEventHero.jsx
"use client";

import Image from "next/image";

export default function FinalEventHero() {
	const BG_DESKTOP = "/fon/fon-white.webp";
	const BG_MOBILE = "/fon/fon-white-mobile.webp";

	const GIRL_LEFT = "/fon/w-1.webp";
	const GIRL_CENTER = "/fon/w-2.webp";
	const GIRL_RIGHT = "/fon/w-3.webp";

	const LOGO = "/logo/logo-b.webp";

	return (
		<section aria-label="Анонс финала премии" className="relative w-full body-fashion">


			<div className="container mx-auto relative rounded-3xl overflow-hidden">
				<div className="absolute right-0 -top-2 sd:-top-6">
					<Image
						src={LOGO}
						alt="Академия моды Марины Кабадарян"
						width={120}
						height={120}
						className="h-12 w-auto sd:h-20 object-contain"
						priority
					/>
				</div>
				<div className="sd:min-h-[80vh] xz:min-h-screen sd:px-0 xz:px-3 sd:py-16 xz:py-10">
					<Image src={BG_DESKTOP} alt="" fill priority className="hidden sd:block object-cover" sizes="(min-width: 992px) 100vw, 0px" />
					<Image src={BG_MOBILE} alt="" fill priority className="sd:hidden object-cover" sizes="(max-width: 991px) 100vw, 0px" />
					{/* <div className="absolute inset-0 bg-white/10" /> */}
				</div>


				<div className="absolute top-0 bottom-0 left-0 right-0 grid sd:grid-cols-2 xz:grid-cols-1 sd:gap-8 xz:gap-1 items-center">

					<div className="relative">
						<div className="hidden sd:flex min-h-[640px] items-end justify-center">
							<div className="relative h-[560px] w-[250px] -mr-20 -mb-8">
								<Image src={GIRL_LEFT} alt="Слева" fill className="object-contain" sizes="250px" />
							</div>
							<div className="relative h-[620px] w-[290px] -mb-1">
								<Image src={GIRL_CENTER} alt="Центр" fill className="object-contain" sizes="290px" />
							</div>
							<div className="relative h-[560px] w-[250px] -ml-20 -mb-8">
								<Image src={GIRL_RIGHT} alt="Справа" fill className="object-contain" sizes="250px" />
							</div>
						</div>

						<div className="sd:hidden flex min-h-[250px] items-end justify-center">
							<div className="relative h-[230px] w-[33%] -mr-8">
								<Image src={GIRL_LEFT} alt="Слева" fill className="object-contain" />
							</div>
							<div className="relative h-[270px] w-[36%] -mb-1">
								<Image src={GIRL_CENTER} alt="Центр" fill className="object-contain" />
							</div>
							<div className="relative h-[230px] w-[33%] -ml-8">
								<Image src={GIRL_RIGHT} alt="Справа" fill className="object-contain" />
							</div>
						</div>
					</div>

					<div className="text-neutral-900 sd:px-0 xz:px-5">

						<h3 className="tracking-wide uppercase xz:text-lg sd:text-xl font-semibold opacity-80">
							Премия красоты «Женщина 2025»
						</h3>

						<h2
							className="mt-3 font-extrabold tracking-widest uppercase xz:text-5xl sd:text-[80px] leading-[1.05]"
							style={{
								color: "transparent",
								backgroundImage:
									"linear-gradient(180deg,#6b0000 0%, #a10606 35%, #b80f0f 55%, #7f0c0c 75%, #c21717 100%)",
								WebkitBackgroundClip: "text",
								backgroundClip: "text",
								textShadow: "0 1px 0 rgba(0,0,0,0.25), 0 0 6px rgba(255,255,255,0.25)",
							}}
						>
							ПРОЙДЕТ
						</h2>

						<div className="sd:mt-4 xz:mt-2 xz:text-base sd:text-lg">
							<div>в отеле «Пекин»</div>
							<div className="mt-1">15 ноября</div>
						</div>

						<ul className="sd:mt-6 xz:mt-3 sd:space-y-3 xz:space-y-1 xz:text-base sd:text-lg">
							<li className="flex items-start gap-3">
								<svg width="18" height="18" viewBox="0 0 24 24" className="mt-1 text-[#7f0c0c]">
									<path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
								</svg>
								Финальное выступление участниц
							</li>
							<li className="flex items-start gap-3">
								<svg width="18" height="18" viewBox="0 0 24 24" className="mt-1 text-[#7f0c0c]">
									<path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
								</svg>
								Показ мод
							</li>
							<li className="flex items-start gap-3">
								<svg width="18" height="18" viewBox="0 0 24 24" className="mt-1 text-[#7f0c0c]">
									<path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
								</svg>
								Награждение участниц
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>


	);
}
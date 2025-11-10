"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const CAT_LABEL = {
	PLUS35: "Категория 35+",
	PLUS50: "Категория 50+",
	PLUS60: "Категория 60+",
	ONLINE: "Online",
};
const ORDER = ["PLUS35", "PLUS50", "PLUS60", "ONLINE"];

/** ── Карточка победительницы (визуал, как на макете) ─────────────────────── */
function WinnerCard({ item }) {
	const g = item?.girl || {};
	const name = `${g.lastName || ""} ${g.firstName || ""}`.trim();

	return (
		<article className="relative">
			<div className="relative">
				<div className="relative">
					<div className="relative m-2 rounded-3xl rotate-[-4deg]">
						<div className="relative aspect-4/5 sd:aspect-4/5">
							<Image
								src={g.mainImage || "/images/placeholder.webp"}
								alt={name || "Победительница"}
								fill
								className="object-cover overflow-hidden rounded-3xl"
								sizes="(min-width: 992px) 33vw, 92vw"
								priority={false}
							/>
						</div>

						{/* Круг с «короной/логотипом» */}
						<div className="absolute -top-5 -right-5">
							<div className="h-16 w-16 sd:h-20 sd:w-20 rounded-full bg-[#D7A64A] shadow-lg grid place-items-center">
								<Image
									src="/logo/logo.webp"
									alt=""
									width={60}
									height={60}
									className="w-9 h-9 sd:w-12 sd:h-12 object-contain drop-shadow"
								/>
							</div>
						</div>

						{/* Золотая плашка с именем и мини-категорией */}
						<div className="absolute -bottom-2 -left-8 right-24 rotate-[-8deg]">
							<div className="rounded-2xl px-5 py-3 shadow-xl"
								style={{
									background:
										"linear-gradient(180deg,#E5B64E 0%, #C49024 65%, #A87613 100%)",
								}}>
								<div className="text-[11px] sd:text-xs tracking-[.18em] uppercase text-black/70 font-semibold">
									{CAT_LABEL[item.category] || "Категория"}
								</div>
								<div className="mt-1 sd:mt-1.5 font-extrabold leading-none text-black"
									style={{ fontSize: "clamp(20px,4vw,34px)", letterSpacing: ".5px" }}>
									{name || "Имя Фамилия"}
								</div>
							</div>

							{/* Серо-перламутровая плашка с городом/возрастом */}
							<div className="mt-3 ml-6 inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-white/85 backdrop-blur text-neutral-700 rotate-[4deg] shadow">
								<span className="text-[12px] sd:text-sm font-medium">
									{g.age ? `${g.age} лет` : ""}{g.age && g.city ? " · " : ""}{g.city || ""}
								</span>
							</div>
						</div>

						{/* Плашка голосов (в правом низу) */}
						<div className="absolute bottom-3 right-3">
							<div className="rounded-full bg-white/92 backdrop-blur px-4 py-2 text-sm font-semibold text-neutral-900 shadow">
								Голоса: {g.votesCount ?? 0}
							</div>
						</div>

						{/* Кнопка «Профиль» */}
						{g.slug && (
							<Link
								href={`/girls/${g.slug}`}
								className="absolute -right-2 -bottom-12 rounded-[18px] sd:rounded-[22px] bg-white text-neutral-900 px-5 sd:px-6 py-3 sd:py-3.5 shadow-xl font-semibold flex items-center gap-2"
							>
								Профиль
								<span aria-hidden>→</span>
							</Link>
						)}
					</div>
				</div>
			</div>
		</article>
	);
}

/** ── Секция победительниц ─────────────────────────────────────────────────── */
export default function WinnersShowcase() {
	const [items, setItems] = useState([]);

	useEffect(() => {
		let abort = false;
		fetch("/api/winners", { cache: "no-store" })
			.then((r) => r.json().catch(() => ({})))
			.then((j) => {
				if (abort) return;
				const arr = Array.isArray(j?.items) ? j.items : [];
				// сортируем по заданному порядку категорий
				const sorted = ORDER.map((c) => arr.find((x) => x.category === c)).filter(Boolean);
				setItems(sorted);
			});
		return () => {
			abort = true;
		};
	}, []);

	if (!items.length) return null;

	return (
		<section
			aria-label="Победительницы по категориям"
			className="relative w-full sd:my-20 xz:my-6 py-20"
		>
			<div className="container mx-auto sd:px-0 xz:px-3">
				{/* заголовок с «короной» сверху */}
				<div className="flex flex-col items-center text-center gap-3 mb-4">
					<div className="sd:mb-9 xz:mb-5">
						<Image src='/fon/crown.webp' alt='Корона' width={300} height={300} className="sd:w-[300px] xz:w-[200px]" />
					</div>
					<div>
						<h2
							className="h-fashion text-3xl sd:text-6xl tracking-tight text-center uppercase"
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
							Победительницы премии
						</h2>
						<p className="text-neutral-300 sd:text-xl text-base mt-6 body-fashion">
							Лучшие участницы в каждой категории текущего сезона
						</p>
					</div>
				</div>

				{/* сетка карточек */}
				<div className="mt-20 grid grid-cols-1 sd:grid-cols-3 gap-8">
					{items.map((it) => (
						<div key={it.category} className="flex flex-col">
							<h3
								className="mb-3 text-center text-sm sd:text-base font-semibold tracking-wide uppercase text-neutral-500"

							>
								{CAT_LABEL[it.category] || it.category}
							</h3>
							<WinnerCard item={it} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

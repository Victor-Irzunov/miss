"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { RiTeamLine, RiBarChart2Line } from "react-icons/ri";

const CAT_LABEL = {
  PLUS35: "35+",
  PLUS50: "50+",
  PLUS60: "60+",
  ONLINE: "Онлайн",
};

export default function AdminHomePage() {
  const router = useRouter();

  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    try {
      const token = localStorage.getItem("token_miss");
      if (!token) return router.replace("/login?from=admin");
      const payload = jwtDecode(token);
      const notExpired =
        typeof payload?.exp !== "number" ? true : payload.exp * 1000 > Date.now();
      if (payload?.isAdmin && notExpired) setAllowed(true);
      else router.replace("/login?from=admin");
    } catch {
      router.replace("/login?from=admin");
    }
  }, [router]);

  const [girlsCount, setGirlsCount] = useState(null);
  const [votesCount, setVotesCount] = useState(null);
  const [loading, setLoading] = useState(true);

  const [catCounts, setCatCounts] = useState({
    PLUS35: 0,
    PLUS50: 0,
    PLUS60: 0,
    ONLINE: 0,
  });

  useEffect(() => {
    if (!allowed) return;
    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token_miss") || "";

        // === ТОЧНОЕ число участниц из таблицы Girl ===
        const gRes = await fetch("/api/admin/girls-count", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: ctrl.signal,
        }).catch(() => null);
        if (gRes?.ok) {
          const j = await gRes.json().catch(() => ({}));
          setGirlsCount(Number(j?.count ?? 0));
        } else {
          setGirlsCount(0);
        }

        // === Сумма голосов
        const vRes = await fetch("/api/admin/votes", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: ctrl.signal,
        }).catch(() => null);
        if (vRes?.ok) {
          const j = await vRes.json().catch(() => ({}));
          const total = (j?.summary || []).reduce((s, r) => s + (r?.total || 0), 0);
          setVotesCount(total || 0);
        } else {
          setVotesCount(0);
        }

        // === Разбивка по категориям (берём список участниц и считаем)
        const listRes = await fetch("/api/admin/girls", {
          cache: "no-store",
          signal: ctrl.signal,
        }).catch(() => null);

        if (listRes?.ok) {
          const j = await listRes.json().catch(() => ({}));
          const items = Array.isArray(j?.items) ? j.items : [];
          const next = { PLUS35: 0, PLUS50: 0, PLUS60: 0, ONLINE: 0 };
          for (const g of items) {
            const key = g?.category || "PLUS35";
            if (next[key] == null) next[key] = 0;
            next[key] += 1;
          }
          setCatCounts(next);

          if (girlsCount == null) setGirlsCount(items.length);
        } else {
          setCatCounts({ PLUS35: 0, PLUS50: 0, PLUS60: 0, ONLINE: 0 });
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [allowed]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!allowed) return <main className="min-h-[60vh]" />;

  return (
    <main
      className="min-h-[80vh] sd:py-40 xz:py-32"
      style={{
        background:
          "radial-gradient(1200px 600px at 0% 0%, rgba(139,92,246,0.18), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(59,130,246,0.15), transparent 55%), linear-gradient(180deg, rgba(18,22,34,1) 0%, rgba(24,27,41,1) 40%, rgba(20,24,38,1) 100%)",
      }}
    >
      <section className="container mx-auto sd:px-0 xz:px-3">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-white">
          <div className="absolute -top-24 -right-24 opacity-20 pointer-events-none select-none">
            <Image src="/fon/woman.webp" alt="" width={420} height={420} />
          </div>

          <div className="p-6 md:p-10">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Панель администратора
            </h1>
            <p className="text-white/80 mt-2 md:max-w-2xl">
              Управляйте участницами и отслеживайте голосование «Женщина 2025».
              Шапка сайта берётся из вашего глобального layout.
            </p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-center">
                <div className="text-sm opacity-70">Участницы</div>
                <div className="text-2xl font-bold">{loading ? "…" : girlsCount ?? 0}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-center">
                <div className="text-sm opacity-70">Всего голосов</div>
                <div className="text-2xl font-bold">{loading ? "…" : votesCount ?? 0}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-center">
                <div className="text-sm opacity-70">Статус</div>
                <div className="text-2xl font-bold">{loading ? "Загрузка…" : "Готово"}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-center">
                <div className="text-sm opacity-70">Доступ</div>
                <div className="text-2xl font-bold">Админ</div>
              </div>
            </div>

            {/* === Разбивка по категориям === */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {["PLUS35", "PLUS50", "PLUS60", "ONLINE"].map((k) => (
                <div
                  key={k}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center"
                >
                  <div className="text-sm opacity-75">Категория</div>
                  <div className="mt-1 text-base font-semibold">{CAT_LABEL[k]}</div>
                  <div className="mt-2 text-2xl font-extrabold">
                    {loading ? "…" : catCounts[k] ?? 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Link
            href="/admin/girls"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 hover:bg-white/5 transition text-white"
          >
            <div className="absolute inset-0 bg-linear-to-tr from-fuchsia-500/10 via-violet-500/10 to-sky-500/10 pointer-events-none" />
            <div className="p-6 md:p-10">
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold">Участницы</div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <RiTeamLine className="text-2xl" />
                </span>
              </div>
              <p className="mt-2 text-white/80">
                Добавление, редактирование, галерея и описание. Полный контроль карточек.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div className="badge badge-lg">Всего: {girlsCount ?? "—"}</div>
                <span className="text-white/80 group-hover:text-white transition">Перейти →</span>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/votes"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 hover:bg-white/5 transition text-white"
          >
            <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 pointer-events-none" />
            <div className="p-6 md:p-10">
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold">Голоса</div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <RiBarChart2Line className="text-2xl" />
                </span>
              </div>
              <p className="mt-2 text-white/80">
                Сводка по участницам и лента последних голосов. Статистика активности.
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div className="badge badge-lg">Всего: {votesCount ?? "—"}</div>
                <span className="text-white/80 group-hover:text-white transition">Перейти →</span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminVotesPage() {
  const [data, setData] = useState({ summary: [], lastVotes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token_miss") || "" : "";
    fetch("/api/admin/votes", {
      headers: { Authorization: `Bearer ${token}` },
      signal: ctrl.signal,
      cache: "no-store",
    })
      .then((r) => r.json().catch(() => ({})))
      .then((j) => {
        if (j?.ok)
          setData({
            summary: j.summary || [],
            lastVotes: j.lastVotes || [],
          });
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, []);

  return (
    <main
      className="min-h-[80vh] sd:py-52 xz:py-28"
      style={{
        background:
          "radial-gradient(1200px 600px at 0% 0%, rgba(139,92,246,0.18), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(59,130,246,0.15), transparent 55%), linear-gradient(180deg, rgba(18,22,34,1) 0%, rgba(24,27,41,1) 40%, rgba(20,24,38,1) 100%)",
      }}
    >
      <section className="container mx-auto sd:px-0 xz:px-3 text-white">
        {/* Верхняя панель с навигацией */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Голоса — админ
          </h1>
          <div className="flex gap-2">
            <Link
              href="/admin"
              className="btn btn-sm btn-outline border-white/40 text-white hover:bg-white/10"
            >
              ← Админ
            </Link>
            <Link
              href="/admin/girls"
              className="btn btn-sm btn-outline border-white/40 text-white hover:bg-white/10"
            >
              Участницы
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 flex items-center gap-3">
            <span className="loading loading-spinner" />
            <span className="opacity-80">Загрузка…</span>
          </div>
        ) : (
          <>
            {/* ===== Итоги по участницам ===== */}
            <section className="mt-4">
              <h2 className="text-xl font-bold mb-3">Итоги по участницам</h2>

              <div className="grid sd:grid-cols-3 xz:grid-cols-1 gap-4">
                {data.summary.map((row) => (
                  <div
                    key={row.girlId}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                          <Image
                            src={row.girl?.mainImage || "/noimg.webp"}
                            alt=""
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {row.girl?.firstName} {row.girl?.lastName}
                          </div>
                          <div className="text-sm text-white/70">{row.girl?.city}</div>
                          <div className="mt-1 inline-flex items-center gap-2">
                            <span className="badge badge-outline border-white/30 text-white">
                              Голосов: <span className="ml-1 font-bold">{row.total}</span>
                            </span>
                            <span className="badge badge-outline border-white/20 text-white/80">
                              #{row.girlId}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {data.summary.length === 0 && (
                  <div className="opacity-80">Пока нет голосов</div>
                )}
              </div>
            </section>

            {/* ===== Лента последних голосов ===== */}
            <section className="mt-10">
              <h2 className="text-xl font-bold mb-3">Последние голоса (100)</h2>

              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-white">ID</th>
                      <th className="text-white">Дата</th>
                      <th className="text-white">Пользователь</th>
                      <th className="text-white">Участница</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lastVotes.map((v) => (
                      <tr key={v.id} className="hover:bg-white/5">
                        <td className="text-white">{v.id}</td>
                        <td className="text-white">
                          {new Date(v.createdAt).toLocaleString()}
                        </td>
                        <td className="text-white">{v.user?.email}</td>
                        <td className="text-white">
                          {v.girl?.firstName} {v.girl?.lastName}{" "}
                          <span className="opacity-70">({v.girl?.slug})</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </section>

      {/* Немного глобальных штрихов для таблицы в тёмной теме */}
      <style jsx global>{`
        .table thead th {
          border-bottom-color: rgba(255, 255, 255, 0.15) !important;
        }
        .table :where(tbody tr:not(:last-child) > td) {
          border-bottom-color: rgba(255, 255, 255, 0.1) !important;
        }
      `}</style>
    </main>
  );
}

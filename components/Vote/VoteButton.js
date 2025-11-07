"use client";

import { useEffect, useMemo, useState } from "react";
import RequireAuthModal from "../modal/RequireAuthModal";
import InfoModal from "../modal/InfoModal";
import Image from "next/image";

function toast(type, msg) {
  try { window.dispatchEvent(new CustomEvent("toast", { detail: { type, msg } })); } catch { }
}

const LOCAL_KEY = "miss_voted_categories"; // { PLUS35: girlId, PLUS50: girlId, PLUS60: girlId, ONLINE: girlId }

function readLocalMap() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return {};
    const j = JSON.parse(raw);
    return j && typeof j === "object" ? j : {};
  } catch {
    return {};
  }
}
function writeLocalMap(map) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(map || {})); } catch { }
}

/**
 * Props:
 * - girlId: number
 * - initialTotal?: number
 * - category: "PLUS35" | "PLUS50" | "PLUS60" | "ONLINE"
 * - fullName: string — для текста кнопки (“Голосовать за Имя Фамилия”)
 */
export default function VoteButton({ girlId, initialTotal = 0, category, fullName = "" }) {
  const [total, setTotal] = useState(initialTotal);
  const [youVoted, setYouVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Информационная модалка
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoTitle, setInfoTitle] = useState("Голосование");
  const [infoMsg, setInfoMsg] = useState("");

  const catKey = useMemo(() => String(category || ""), [category]);
  const safeName = String(fullName || "").trim();

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/api/votes?girlId=${girlId}`, {
      headers: {
        Authorization:
          typeof window !== "undefined"
            ? `Bearer ${localStorage.getItem("token_miss") || ""}`
            : "",
      },
      signal: ctrl.signal,
      cache: "no-store",
    })
      .then((r) => r.json().catch(() => ({})))
      .then((j) => {
        if (j?.ok) {
          setTotal(typeof j.total === "number" ? j.total : initialTotal);
          setYouVoted(!!j.youVoted);
          if (j.youVoted && catKey) {
            const map = readLocalMap();
            if (!map[catKey]) { map[catKey] = girlId; writeLocalMap(map); }
          }
        }
      })
      .catch(() => { });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [girlId, catKey, initialTotal]);

  const blockWithModal = (msg, title = "Голосование") => {
    setInfoTitle(title);
    setInfoMsg(msg);
    setInfoOpen(true);
  };

  const canVoteLocal = () => {
    if (!catKey) return true;
    const map = readLocalMap();
    const already = map[catKey];

    if (already && Number(already) === Number(girlId)) {
      blockWithModal("Вы уже голосовали за эту участницу в данной категории.", "Уже голосовали");
      return false;
    }
    if (already && Number(already) !== Number(girlId)) {
      blockWithModal("Можно проголосовать только один раз в каждой категории. Вы уже выбрали другую участницу в этой категории.", "Ограничение по категории");
      return false;
    }
    const votedCount = Object.keys(map).filter((k) => !!map[k]).length;
    if (votedCount >= 4 && !map[catKey]) {
      blockWithModal("Вы уже проголосовали во всех категориях (максимум 4 голоса — по одному в каждой).", "Лимит голосов");
      return false;
    }
    return true;
  };

  const vote = async () => {
    if (!canVoteLocal()) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token_miss") : "";
    if (!token) { setShowAuth(true); return; }
    if (youVoted) {
      blockWithModal("Вы уже голосовали в этой категории. Повторное голосование невозможно.", "Уже голосовали");
      return;
    }

    try {
      setLoading(true);
      const r = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ girlId }),
      });
      const j = await r.json().catch(() => ({}));

      if (!r.ok) {
        if (r.status === 409) {
          blockWithModal(j?.message || "Вы уже голосовали в этой категории.", "Ограничение по категории");
          if (catKey) {
            const map = readLocalMap();
            if (!map[catKey]) { map[catKey] = girlId; writeLocalMap(map); }
          }
          setYouVoted(true);
          return;
        }
        if (r.status === 401) { setShowAuth(true); return; }
        throw new Error();
      }

      setTotal(typeof j.total === "number" ? j.total : total + 1);
      setYouVoted(true);
      if (catKey) {
        const map = readLocalMap();
        map[catKey] = girlId;
        writeLocalMap(map);
      }
      toast("success", "Спасибо! Ваш голос учтён.");
    } catch {
      toast("error", "Не удалось отправить голос");
    } finally {
      setLoading(false);
    }
  };

  const baseBtn =
    "inline-flex items-center justify-center rounded-2xl font-extrabold transition " +
    "shadow-[0_12px_40px_rgba(167,5,208,0.45)] focus:outline-none focus:ring-4 " +
    "focus:ring-[#A705D0]/50 focus:ring-offset-2 focus:ring-offset-black";

  const gradient =
    "bg-[linear-gradient(90deg,#A705D0_0%,#C117E9_50%,#FF41F8_100%)] " +
    "hover:brightness-110 active:brightness-95";

  // Большая, заметная кнопка
  const sizing =
    "text-lg sd:text-xl px-7 sd:px-10 py-4 sd:py-5 w-full sd:w-auto";

  const label = youVoted
    ? "Голос учтён"
    : (loading ? "Отправка…" : `Голосовать за ${safeName || "участницу"}`);

  const aria = youVoted
    ? "Вы уже голосовали в этой категории"
    : `Голосовать за ${safeName || "участницу"}`;

  return (
    <>
      <div className="mt-6 flex flex-col space-y-3 gap-4">
        <div className="badge badge-lg">
          Голосов: <span className="ml-1 font-semibold">{total}</span>
        </div>
        <button
          type="button"
          onClick={vote}
          disabled={loading || youVoted}
          className={[
            baseBtn,
            gradient,
            sizing,
            youVoted ? "opacity-80 cursor-not-allowed" : "",
          ].join(" ")}
          aria-label={aria}
          title={aria}
        >
          <Image src='/svg/heart-white.svg' alt='Иконка сердце' width={30} height={30} className="mr-2" />
          {label}
        </button>


      </div>

      <RequireAuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      <InfoModal open={infoOpen} title={infoTitle} message={infoMsg} onClose={() => setInfoOpen(false)} />
    </>
  );
}

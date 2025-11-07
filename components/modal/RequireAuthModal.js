// /components/Modal/RequireAuthModal.jsx — СОЗДАЙ ФАЙЛ ПОЛНОСТЬЮ
"use client";

export default function RequireAuthModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal modal-open text-black">
      <div className="modal-box relative">
        <button
          type="button"
          aria-label="Закрыть"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="font-bold text-lg">Нужно зарегистрироваться</h3>
        <p className="py-3 text-sm opacity-80">
          Чтобы оставить голос за участницу — войдите или зарегистрируйтесь.
        </p>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>В другой раз</button>
          <a
            href={`/login?from=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
            className="btn btn-primary"
          >
            Зарегистрироваться
          </a>
        </div>
      </div>
    </div>
  );
}

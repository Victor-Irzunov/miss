"use client";

import { useEffect } from "react";

export default function InfoModal({ open, title = "Сообщение", message = "", onClose }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box bg-base-100 text-base-content">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-3 leading-relaxed">{message}</p>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={onClose}>Понятно</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Закрыть" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}

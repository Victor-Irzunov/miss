// /lib/toast.js — СОЗДАЙ ФАЙЛ ПОЛНОСТЬЮ
// Лёгкие тосты под DaisyUI. Императивный API: toast.success/info/warning/error(text)
"use client";

let container = null;

function ensureContainer() {
  if (typeof window === "undefined") return null;
  if (container && document.body.contains(container)) return container;

  container = document.createElement("div");
  container.className = "toast toast-end z-[9999] pointer-events-none";
  // позиция: справа-сверху
  container.style.position = "fixed";
  container.style.top = "16px";
  container.style.right = "16px";
  document.body.appendChild(container);

  return container;
}

function makeAlert(type = "info", text = "") {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} shadow pointer-events-auto`;
  alert.style.marginTop = "8px";
  alert.innerHTML = `<span>${text}</span>`;
  return alert;
}

function show(text, type = "info", ms = 2600) {
  const root = ensureContainer();
  if (!root) return;

  const el = makeAlert(type, text);
  root.appendChild(el);

  // авто-скрытие
  const timer = setTimeout(() => {
    try {
      el.style.opacity = "0";
      el.style.transition = "opacity .25s ease";
      setTimeout(() => root.contains(el) && root.removeChild(el), 250);
    } catch {}
  }, ms);

  // закрытие по клику
  el.addEventListener("click", () => {
    clearTimeout(timer);
    if (root.contains(el)) root.removeChild(el);
  });
}

export const toast = {
  success: (t) => show(t, "success"),
  info: (t) => show(t, "info"),
  warning: (t) => show(t, "warning"),
  error: (t) => show(t, "error"),
};

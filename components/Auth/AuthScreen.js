"use client";

import { useEffect, useState } from "react";
import LoginForm from "@/components/Form/FormLogin";
import RegistrationForm from "@/components/Form/RegistrationForm";

export default function AuthScreen({ search }) {
  const [isActive, setIsActive] = useState(true); // true => login, false => register

  // Если есть #register — сразу открываем вкладку «Регистрация»
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#register") {
      setIsActive(false);
    }
  }, []);

  return (
    <section
      className="min-h-screen py-32 relative"
      style={{
      backgroundImage: [
        "radial-gradient(1200px 800px at 15% 85%, rgba(152, 104, 44, 0.88) 0%, rgba(152, 104, 44, 0.58) 40%, rgba(152, 104, 44, 0) 70%)",
        "radial-gradient(900px 700px at 92% 8%, rgba(34, 74, 52, 0.70) 0%, rgba(34, 74, 52, 0.28) 45%, rgba(34, 74, 52, 0) 72%)",
        "radial-gradient(130% 100% at 50% 0%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%)",
        "linear-gradient(180deg, #141826 5%, #1C1F2E 42%, #564733 100%)",
      ].join(", "),
      backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
      backgroundAttachment: "scroll, scroll, scroll, scroll",
      backgroundSize: "cover, cover, cover, cover",
      backgroundPosition: "center, center, center, center",
    }}
    >
      <div className="container mx-auto sd:max-w-5xl xz:px-3">
        <div className="mx-auto max-w-xl">
          <div className="tabs tabs-boxed mb-6">
            <button
              className={`tab ${isActive ? "tab-active text-white" : ""} text-white/70`}
              onClick={() => setIsActive(true)}
            >
              Вход
            </button>
            <button
              className={`tab ${!isActive ? "tab-active text-white" : ""} text-white/70`}
              onClick={() => setIsActive(false)}
            >
              Регистрация
            </button>
          </div>

          {isActive ? (
            <LoginForm setIsActive={setIsActive} search={search} />
          ) : (
            <RegistrationForm setIsActive={setIsActive} search={search} />
          )}
        </div>
      </div>
    </section>
  );
}

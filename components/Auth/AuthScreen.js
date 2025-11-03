// /components/Auth/AuthScreen.jsx
"use client";

import { useState } from "react";
import LoginForm from "@/components/Form/FormLogin";
import RegistrationForm from "@/components/Form/RegistrationForm";

export default function AuthScreen({ search }) {
  const [isActive, setIsActive] = useState(true); // true => login, false => register

  return (
    <section className="min-h-screen py-24 relative">
      <div className="container mx-auto sd:max-w-5xl xz:px-3">
        <div className="mx-auto max-w-xl">
          <div className="tabs tabs-boxed mb-6">
            <button
              className={`tab ${isActive ? "tab-active" : ""}`}
              onClick={() => setIsActive(true)}
            >
              Вход
            </button>
            <button
              className={`tab ${!isActive ? "tab-active" : ""}`}
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

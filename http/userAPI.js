// /http/userAPI.js — заменить сохранение токена на token_miss
import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async ({ email, password, isAdmin }) => {
  const { data } = await $host.post("/api/user/register", { email, password, isAdmin: false });
  localStorage.setItem("token_miss", data.token);
  return jwtDecode(data.token);
};

export const login = async ({ email, password }) => {
  const { data } = await $host.post("/api/user/login", { email, password });
  localStorage.setItem("token_miss", data.token);
  return jwtDecode(data.token);
};

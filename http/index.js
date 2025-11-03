// /http/index.js
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";

export const $host = axios.create({ baseURL });
export const $authHost = axios.create({ baseURL });

$authHost.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token_miss") : null;
  if (token) config.headers.authorization = `Bearer ${token}`;
  return config;
});

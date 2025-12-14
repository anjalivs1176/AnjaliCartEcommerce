import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ??
  "https://anjalicart-backend.onrender.com/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const PUBLIC_ROUTES = [
  "/auth",
  "/seller/login",
  "/seller/verify",
];

api.interceptors.request.use((config) => {
  const url = config.url || "";

  if (PUBLIC_ROUTES.some((route) => url.startsWith(route))) {
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

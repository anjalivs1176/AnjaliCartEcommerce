
import axios from "axios";

export const API_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: API_URL,
});

// routes that MUST NOT get Authorization header
const PUBLIC_ROUTES = [
  "/auth",         
  "/seller/login",
  "/seller/verify",
];

api.interceptors.request.use((config) => {
  const url = config.url || "";

  // skip token for public routes
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




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
  "/public",
  "/home-category",
  "/deals",
  "/categories",
  "/products",
  "/reviews",
  "/search",
];

api.interceptors.request.use((config) => {
  const url = config.url ?? "";

 const isPublic = PUBLIC_ROUTES.some(route =>
  url.startsWith(route)
);


  if (!isPublic) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

export default api;

import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ??
  "https://anjalicart-backend.onrender.com/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ✅ ALL PUBLIC APIs (DO NOT SEND TOKEN)
const PUBLIC_ROUTES = [
  "/auth",
  "/seller/login",
  "/seller/verify",

  // PUBLIC DATA
  "/categories",
  "/deals",
  "/home-category",
  "/products",
  "/reviews",
  "/search",
];

// api.interceptors.request.use((config) => {
//   const url = config.url || "";

//   // If public route → don't attach token
//   if (PUBLIC_ROUTES.some((route) => url.startsWith(route))) {
//     return config;
//   }

//   // Protected routes → attach token
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });



api.interceptors.request.use((config) => {
  const url = config.url || "";

  // normalize url (remove /api if present)
  const cleanUrl = url.replace("/api", "");

  const isPublic = PUBLIC_ROUTES.some((route) =>
    cleanUrl.startsWith(route)
  );

  if (isPublic) {
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

// import axios from "axios";

// const API_URL =
//   process.env.REACT_APP_API_URL ??
//   "https://anjalicart-backend.onrender.com/api";

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: false,
// });

// // PUBLIC ROUTES (NO TOKEN)
// const PUBLIC_ROUTES = [
//   "/auth",
//   "/categories",
//   "/products",
//   "/reviews",
//   "/search",
//   "/deals",
//   "/home-category",
// ];

// api.interceptors.request.use((config) => {
//   const url = config.url || "";

//   // Public → no token
//   if (PUBLIC_ROUTES.some((route) => url.startsWith(route))) {
//     return config;
//   }

//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;





import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ??
  "https://anjalicart-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

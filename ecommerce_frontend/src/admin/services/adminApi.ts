import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const adminApi = {
  // ---------------- SELLERS ----------------
  getSellers: (status?: string) =>
    api.get("/admin/sellers", { params: { status } }),

  updateSellerStatus: (id: number, status: string) =>
    api.put(`/admin/sellers/${id}/status`, { status }),

  // ---------------- COUPONS ----------------
  getCoupons: () => api.get("/coupons/admin/all"),
  deleteCoupon: (id: number) => api.delete(`/coupons/admin/delete/${id}`),
  createCoupon: (data: any) => api.post("/coupons/admin/create", data),

  // ---------------- HOME CATEGORIES ----------------
  getHomeCategories: () => api.get("/admin/home-category"),
  createHomeCategory: (data: any) =>
    api.post("/admin/home-category", data),
  updateHomeCategory: (id: number, data: any) =>
    api.patch(`/admin/home-category/${id}`, data),
  deleteHomeCategory: (id: number) =>
    api.delete(`/admin/home-category/${id}`),

  // ---------------- DEALS ----------------
  createDeal: (data: any) => api.post("/deals", data),
  getDeals: () => api.get("/deals"),
  updateDeal: (id: any, data: any) => api.patch(`/deals/${id}`, data),
  deleteDeal: (id: any) => api.delete(`/deals/${id}`),

  // ---------------- PRODUCT CATEGORIES ----------------
  createCategory: (data: any) => api.post("/categories", data),
  getCategories: () => api.get("/categories"),
  updateCategory: (id: number, data: any) =>
    api.put(`/categories/${id}`, data),
  deleteCategory: (id: number) =>
    api.delete(`/categories/${id}`),
};

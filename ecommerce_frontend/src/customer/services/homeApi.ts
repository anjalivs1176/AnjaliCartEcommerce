import { api } from "../../config/api";

export const homeApi = {
  getHomeCategories: () => api.get("/api/public/home-category"),
};


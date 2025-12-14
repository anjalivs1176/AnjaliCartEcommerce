import { api } from "../../config/api";

export const homeApi = {
  getHomeCategories: () => api.get("/public/home-category"),
};


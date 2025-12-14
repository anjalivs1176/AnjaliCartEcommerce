import { api } from "../../config/api";

export const homeApi = {
  getHomeCategories: () => api.get("/home-category"),
};


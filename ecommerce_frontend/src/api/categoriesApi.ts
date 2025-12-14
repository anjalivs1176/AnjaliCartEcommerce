
import api from "../config/api";

export const categoriesApi = {
  getCategories() {
    return api.get("/categories");
  },
};

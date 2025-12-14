
import api from "../config/api";

export const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    console.log("response ", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

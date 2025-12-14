import { api } from "../config/api"

export const dealApi = {
  createDeal: (data:any) => api.post("/deals", data),
  getDeals: () => api.get("/deals"),
  updateDeal: (id:number, data:any) => api.patch(`deals/${id}`, data),
  deleteDeal: (id:number) => api.delete(`/deals/${id}`),
};







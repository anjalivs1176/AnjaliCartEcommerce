import { api } from "../config/api"

export const dealApi = {
  createDeal: (data:any) => api.post("/api/deals", data),
  getDeals: () => api.get("/api/deals"),
  updateDeal: (id:number, data:any) => api.patch(`/api/deals/${id}`, data),
  deleteDeal: (id:number) => api.delete(`/api/deals/${id}`),
};







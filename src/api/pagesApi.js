import { apiClient } from "./client";

export const pagesApi = {
  getAll(journeyId) {
    return apiClient.get("/pages", journeyId ? { journeyId } : undefined);
  },

  getById(id) {
    return apiClient.get(`/pages/${id}`);
  },

  create(page) {
    return apiClient.post("/pages", page);
  },

  savePage(id, pageData) {
    return apiClient.put(`/pages/${id}`, pageData);
  },

  delete(id) {
    return apiClient.delete(`/pages/${id}`);
  },
};

export default pagesApi;

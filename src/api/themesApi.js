import { apiClient } from "./client";

export const themesApi = {
  getAll(componentType) {
    return apiClient.get("/themes", componentType ? { componentType } : undefined);
  },

  getById(id) {
    return apiClient.get(`/themes/${id}`);
  },

  saveTheme(theme) {
    return apiClient.post("/themes", theme);
  },

  updateTheme(id, updates) {
    return apiClient.put(`/themes/${id}`, updates);
  },

  deleteTheme(id) {
    return apiClient.delete(`/themes/${id}`);
  },
};

export default themesApi;

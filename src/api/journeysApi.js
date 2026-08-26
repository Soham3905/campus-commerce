import { apiClient } from "./client";

export const journeysApi = {
  getAll() {
    return apiClient.get("/journeys");
  },

  getById(id) {
    return apiClient.get(`/journeys/${id}`);
  },

  create(journey) {
    return apiClient.post("/journeys", journey);
  },

  update(id, updates) {
    return apiClient.put(`/journeys/${id}`, updates);
  },

  delete(id) {
    return apiClient.delete(`/journeys/${id}`);
  },
};

export default journeysApi;

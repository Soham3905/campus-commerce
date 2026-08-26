import { apiClient } from "./client";

export const interfacesApi = {
  getAll() {
    return apiClient.get("/interfaces");
  },
};

export default interfacesApi;

import { apiClient } from "./client";

export const branchesApi = {
  getAll(journeyId) {
    return apiClient.get("/branches", journeyId ? { journeyId } : undefined);
  },

  getById(id) {
    return apiClient.get(`/branches/${id}`);
  },

  createBranch({ journeyId, sourceBranchId, name, description }) {
    return apiClient.post("/branches", {
      journeyId,
      sourceBranchId,
      name,
      description,
    });
  },

  saveSnapshot(branchId, pageId, schema) {
    return apiClient.put(`/branches/${branchId}/snapshots/${pageId}`, { schema });
  },

  deleteBranch(id) {
    return apiClient.delete(`/branches/${id}`);
  },
};

export default branchesApi;

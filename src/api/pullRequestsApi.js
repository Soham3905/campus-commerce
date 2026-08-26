import { apiClient } from "./client";

export const pullRequestsApi = {
  getAll(journeyId) {
    return apiClient.get("/pull-requests", journeyId ? { journeyId } : undefined);
  },

  getById(id) {
    return apiClient.get(`/pull-requests/${id}`);
  },

  createPullRequest({ journeyId, sourceBranchId, targetBranchId, title, description }) {
    return apiClient.post("/pull-requests", {
      journeyId,
      sourceBranchId,
      targetBranchId,
      title,
      description,
    });
  },

  approve(id) {
    return apiClient.patch(`/pull-requests/${id}/approve`);
  },

  reject(id) {
    return apiClient.patch(`/pull-requests/${id}/reject`);
  },

  merge(id) {
    return apiClient.patch(`/pull-requests/${id}/merge`);
  },
};

export default pullRequestsApi;

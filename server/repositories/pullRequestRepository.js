import { JsonRepository } from "./jsonRepository.js";

const FILE_NAME = "pullRequests.json";

export const PullRequestRepository = {
  async getAll() {
    return JsonRepository.read(FILE_NAME, []);
  },

  async getById(id) {
    return JsonRepository.findOne(FILE_NAME, (pr) => pr.id === id);
  },

  async getByJourneyId(journeyId) {
    return JsonRepository.find(FILE_NAME, (pr) => !pr.journeyId || pr.journeyId === journeyId);
  },

  async create(pr) {
    const record = {
      ...pr,
      id: pr.id || `pr-${Date.now()}`,
      status: pr.status || "open",
      changes: pr.changes || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return JsonRepository.insert(FILE_NAME, record);
  },

  async update(id, updates) {
    return JsonRepository.update(FILE_NAME, id, (existing) => ({
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  },

  async delete(id) {
    return JsonRepository.remove(FILE_NAME, id);
  },
};

export default PullRequestRepository;

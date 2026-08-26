import { JsonRepository } from "./jsonRepository.js";

const FILE_NAME = "branches.json";

export const BranchRepository = {
  async getAll() {
    return JsonRepository.read(FILE_NAME, []);
  },

  async getById(id) {
    return JsonRepository.findOne(FILE_NAME, (b) => b.id === id);
  },

  async getByJourneyId(journeyId) {
    return JsonRepository.find(FILE_NAME, (b) => !b.journeyId || b.journeyId === journeyId);
  },

  async create(branch) {
    const record = {
      ...branch,
      id: branch.id || `branch-${Date.now()}`,
      status: branch.status || "active",
      pageSnapshots: branch.pageSnapshots || {},
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

  async updateSnapshot(branchId, pageId, schema) {
    return JsonRepository.update(FILE_NAME, branchId, (existing) => ({
      ...existing,
      pageSnapshots: {
        ...(existing.pageSnapshots || {}),
        [pageId]: schema,
      },
      updatedAt: new Date().toISOString(),
    }));
  },

  async delete(id) {
    if (id === "main") {
      throw new Error("Cannot delete main branch");
    }
    return JsonRepository.remove(FILE_NAME, id);
  },
};

export default BranchRepository;

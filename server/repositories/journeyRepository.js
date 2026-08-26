import { JsonRepository } from "./jsonRepository.js";

const FILE_NAME = "journeys.json";

export const JourneyRepository = {
  async getAll() {
    return JsonRepository.read(FILE_NAME, []);
  },

  async getById(id) {
    return JsonRepository.findOne(FILE_NAME, (j) => j.id === id);
  },

  async create(journey) {
    const record = {
      ...journey,
      id: journey.id || `journey-${Date.now()}`,
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

export default JourneyRepository;

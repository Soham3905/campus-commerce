import { JsonRepository } from "./jsonRepository.js";

const FILE_NAME = "pages.json";

export const PageRepository = {
  async getAll() {
    return JsonRepository.read(FILE_NAME, []);
  },

  async getById(id) {
    return JsonRepository.findOne(FILE_NAME, (p) => p.id === id);
  },

  async getByJourneyId(journeyId) {
    return JsonRepository.find(FILE_NAME, (p) => p.journeyId === journeyId);
  },

  async create(page) {
    const record = {
      ...page,
      id: page.id || `page_${Date.now()}`,
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

export default PageRepository;

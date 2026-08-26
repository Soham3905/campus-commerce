import { JsonRepository } from "./jsonRepository.js";

const FILE_NAME = "interfaces.json";

export const InterfaceRepository = {
  async getAll() {
    return JsonRepository.read(FILE_NAME, []);
  },

  async getById(id) {
    return JsonRepository.findOne(FILE_NAME, (i) => i.id === id);
  },

  async create(item) {
    const record = {
      ...item,
      id: item.id || `interface-${Date.now()}`,
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

export default InterfaceRepository;

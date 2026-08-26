import { JsonRepository } from "./jsonRepository.js";

const FILE_NAME = "themes.json";

export const ThemeRepository = {
  async getAll() {
    return JsonRepository.read(FILE_NAME, []);
  },

  async getById(id) {
    return JsonRepository.findOne(FILE_NAME, (t) => t.id === id);
  },

  async getByComponentType(componentType) {
    return JsonRepository.find(FILE_NAME, (t) => t.componentType === componentType);
  },

  async create(theme) {
    const record = {
      ...theme,
      id: theme.id || `theme-${Date.now()}`,
      isCustom: true,
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
    const theme = await this.getById(id);
    if (theme && !theme.isCustom) {
      throw new Error("Cannot delete predefined system theme");
    }
    return JsonRepository.remove(FILE_NAME, id);
  },
};

export default ThemeRepository;

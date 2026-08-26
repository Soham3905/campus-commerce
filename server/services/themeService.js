import { ThemeRepository } from "../repositories/themeRepository.js";

export const ThemeService = {
  async getAllThemes(componentType) {
    if (componentType) {
      return ThemeRepository.getByComponentType(componentType);
    }
    return ThemeRepository.getAll();
  },

  async getThemeById(id) {
    const theme = await ThemeRepository.getById(id);
    if (!theme) {
      const error = new Error(`Theme with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "THEME_NOT_FOUND";
      throw error;
    }
    return theme;
  },

  async createTheme(data) {
    if (!data.name || !data.componentType) {
      const error = new Error("Theme name and componentType are required.");
      error.statusCode = 400;
      error.code = "VALIDATION_ERROR";
      throw error;
    }

    return ThemeRepository.create(data);
  },

  async updateTheme(id, data) {
    const existing = await ThemeRepository.getById(id);
    if (!existing) {
      const error = new Error(`Theme with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "THEME_NOT_FOUND";
      throw error;
    }

    return ThemeRepository.update(id, data);
  },

  async deleteTheme(id) {
    const existing = await ThemeRepository.getById(id);
    if (!existing) {
      const error = new Error(`Theme with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "THEME_NOT_FOUND";
      throw error;
    }

    await ThemeRepository.delete(id);
    return { deletedId: id };
  },
};

export default ThemeService;

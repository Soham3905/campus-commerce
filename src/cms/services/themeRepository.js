/**
 * Theme Repository — Manages retrieval, creation, duplication, and storage of component themes.
 */

import { StorageService } from "./storage";
import { PredefinedThemes } from "../../registry/themeRegistry";
import { generateId } from "../utils/idUtils";

const THEMES_STORAGE_KEY = "campus_sdui_custom_themes";

export const ThemeRepository = {
  /**
   * Retrieves all themes (both predefined and custom).
   * @returns {Array<Object>}
   */
  getAll() {
    const predefined = Object.values(PredefinedThemes);
    const custom = StorageService.get(THEMES_STORAGE_KEY, []);
    return [...predefined, ...custom];
  },

  /**
   * Gets themes for a specific component type.
   * @param {string} componentType
   * @returns {Array<Object>}
   */
  getByComponentType(componentType) {
    const all = this.getAll();
    return all.filter((t) => t.componentType === componentType);
  },

  /**
   * Retrieves a theme by its unique ID.
   * @param {string} themeId
   * @returns {Object|null}
   */
  getById(themeId) {
    const all = this.getAll();
    return all.find((t) => t.id === themeId) || null;
  },

  /**
   * Saves a custom theme (creates or updates).
   * @param {Object} theme
   * @returns {Object} Saved theme
   */
  save(theme) {
    const custom = StorageService.get(THEMES_STORAGE_KEY, []);
    const existingIndex = custom.findIndex((t) => t.id === theme.id);

    const now = new Date().toISOString();
    let updatedCustom;
    let savedTheme;

    if (existingIndex >= 0) {
      savedTheme = {
        ...custom[existingIndex],
        ...theme,
        updatedAt: now,
      };
      updatedCustom = [...custom];
      updatedCustom[existingIndex] = savedTheme;
    } else {
      savedTheme = {
        id: theme.id || `custom-theme-${generateId()}`,
        componentType: theme.componentType || "ProductCard",
        name: theme.name || "Custom Theme",
        description: theme.description || "Custom user theme",
        isCustom: true,
        tokens: theme.tokens || {},
        styles: theme.styles || {},
        createdAt: now,
        updatedAt: now,
      };
      updatedCustom = [...custom, savedTheme];
    }

    StorageService.set(THEMES_STORAGE_KEY, updatedCustom);
    return savedTheme;
  },

  /**
   * Duplicates an existing theme as a new custom theme.
   * @param {string} themeId
   * @returns {Object|null} Duplicated theme
   */
  duplicate(themeId) {
    const original = this.getById(themeId);
    if (!original) return null;

    const duplicated = {
      ...JSON.parse(JSON.stringify(original)),
      id: `custom-theme-${generateId()}`,
      name: `${original.name} (Copy)`,
      description: `Custom variation of ${original.name}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.save(duplicated);
  },

  /**
   * Deletes a custom theme by ID. (Predefined themes cannot be deleted).
   * @param {string} themeId
   * @returns {boolean}
   */
  delete(themeId) {
    if (PredefinedThemes[themeId]) {
      console.warn("Cannot delete predefined system theme");
      return false;
    }

    const custom = StorageService.get(THEMES_STORAGE_KEY, []);
    const filtered = custom.filter((t) => t.id !== themeId);
    StorageService.set(THEMES_STORAGE_KEY, filtered);
    return true;
  },
};

export default ThemeRepository;

import { StorageService } from "./storage";
import { defaultPages } from "../../schema/defaultPages";
import { generateId } from "../utils/idUtils";
import { cloneTree } from "../utils/treeUtils";

const PAGES_STORAGE_KEY = "campus_sdui_pages";

export const PageRepository = {
  getAll() {
    const pages = StorageService.get(PAGES_STORAGE_KEY, null);
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      StorageService.set(PAGES_STORAGE_KEY, defaultPages);
      return defaultPages;
    }
    return pages;
  },

  getById(id) {
    const pages = this.getAll();
    return pages.find((p) => p.id === id) || null;
  },

  save(page) {
    const pages = this.getAll();
    const existingIndex = pages.findIndex((p) => p.id === page.id);
    const now = new Date().toISOString();

    let savedId;
    let updatedPages;
    if (existingIndex >= 0) {
      updatedPages = [...pages];
      updatedPages[existingIndex] = {
        ...updatedPages[existingIndex],
        ...page,
        updatedAt: now,
      };
      savedId = page.id;
    } else {
      const newPage = {
        id: page.id || generateId("page"),
        name: page.name || "Untitled Page",
        route: page.route || "custom",
        interfaceId: page.interfaceId || "blank-page",
        schema: page.schema || {},
        createdAt: now,
        updatedAt: now,
      };
      savedId = newPage.id;
      updatedPages = [newPage, ...pages];
    }

    StorageService.set(PAGES_STORAGE_KEY, updatedPages);
    return updatedPages.find((p) => p.id === savedId) || null;
  },

  duplicate(id) {
    const original = this.getById(id);
    if (!original) return null;

    const duplicated = {
      ...cloneTree(original),
      id: generateId("page"),
      name: `${original.name} (Copy)`,
      route: `${original.route || "page"}_copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const pages = this.getAll();
    const updatedPages = [duplicated, ...pages];
    StorageService.set(PAGES_STORAGE_KEY, updatedPages);
    return duplicated;
  },

  rename(id, newName) {
    const pages = this.getAll();
    const updatedPages = pages.map((p) =>
      p.id === id ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p
    );
    StorageService.set(PAGES_STORAGE_KEY, updatedPages);
    return this.getById(id);
  },

  delete(id) {
    const pages = this.getAll();
    const filtered = pages.filter((p) => p.id !== id);
    StorageService.set(PAGES_STORAGE_KEY, filtered);
    return filtered;
  },

  resetDefaults() {
    StorageService.set(PAGES_STORAGE_KEY, defaultPages);
    return defaultPages;
  },
};

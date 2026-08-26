import { StorageService } from "./storage";
import { defaultInterfaces } from "../../schema/defaultInterfaces";
import { generateId } from "../utils/idUtils";
import { cloneTree } from "../utils/treeUtils";

const INTERFACES_STORAGE_KEY = "campus_sdui_interfaces_v4";

export const InterfaceRepository = {
  getAll() {
    const interfaces = StorageService.get(INTERFACES_STORAGE_KEY, null);
    if (!interfaces || !Array.isArray(interfaces) || interfaces.length === 0) {
      StorageService.set(INTERFACES_STORAGE_KEY, defaultInterfaces);
      return defaultInterfaces;
    }
    return interfaces;
  },

  getById(id) {
    const list = this.getAll();
    return list.find((i) => i.id === id) || null;
  },

  save(blueprint) {
    const list = this.getAll();
    const existingIndex = list.findIndex((i) => i.id === blueprint.id);

    let updatedList;
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = {
        ...updatedList[existingIndex],
        ...blueprint,
      };
    } else {
      const newBlueprint = {
        id: blueprint.id || generateId("interface"),
        name: blueprint.name || "Custom Blueprint",
        description: blueprint.description || "User-created reusable interface blueprint",
        icon: blueprint.icon || "📄",
        category: blueprint.category || "Custom",
        schema: blueprint.schema || {},
      };
      updatedList = [newBlueprint, ...list];
    }

    StorageService.set(INTERFACES_STORAGE_KEY, updatedList);
    return this.getById(blueprint.id);
  },

  duplicate(id) {
    const original = this.getById(id);
    if (!original) return null;

    const duplicated = {
      ...cloneTree(original),
      id: generateId("interface"),
      name: `${original.name} (Copy)`,
      description: `Copy of ${original.name}`,
    };

    const list = this.getAll();
    const updatedList = [duplicated, ...list];
    StorageService.set(INTERFACES_STORAGE_KEY, updatedList);
    return duplicated;
  },

  rename(id, newName) {
    const list = this.getAll();
    const updatedList = list.map((item) =>
      item.id === id ? { ...item, name: newName } : item
    );
    StorageService.set(INTERFACES_STORAGE_KEY, updatedList);
    return this.getById(id);
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter((item) => item.id !== id);
    StorageService.set(INTERFACES_STORAGE_KEY, filtered);
    return filtered;
  },

  resetDefaults() {
    StorageService.set(INTERFACES_STORAGE_KEY, defaultInterfaces);
    return defaultInterfaces;
  },
};

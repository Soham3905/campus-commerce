/**
 * Storage service — abstracted LocalStorage adapter with in-memory fallback.
 */

const memoryStore = new Map();

export const StorageService = {
  get(key, defaultValue = null) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
    } catch (e) {
      console.warn(`[StorageService] Failed to read "${key}" from localStorage:`, e);
    }
    return memoryStore.has(key) ? memoryStore.get(key) : defaultValue;
  },

  set(key, value) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.warn(`[StorageService] Failed to write "${key}" to localStorage:`, e);
    }
    memoryStore.set(key, value);
  },

  remove(key) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[StorageService] Failed to remove "${key}":`, e);
    }
    memoryStore.delete(key);
  },
};

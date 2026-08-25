import { StorageService } from "./storage";
import { defaultJourneys } from "../../schema/defaultJourneys";
import { generateId } from "../utils/idUtils";

const JOURNEYS_STORAGE_KEY = "campus_sdui_journeys";

export const JourneyRepository = {
  getAll() {
    const list = StorageService.get(JOURNEYS_STORAGE_KEY, null);
    if (!list || !Array.isArray(list) || list.length === 0) {
      StorageService.set(JOURNEYS_STORAGE_KEY, defaultJourneys);
      return defaultJourneys;
    }
    return list;
  },

  getById(id) {
    const list = this.getAll();
    return list.find((j) => j.id === id) || null;
  },

  save(journey) {
    const list = this.getAll();
    const existingIndex = list.findIndex((j) => j.id === journey.id);
    const now = new Date().toISOString();

    let savedId;
    let updated;
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...journey,
        updatedAt: now,
      };
      savedId = journey.id;
    } else {
      const newJourney = {
        id: journey.id || `journey-${generateId()}`,
        name: journey.name || "Untitled Journey",
        description: journey.description || "Student e-commerce user journey",
        icon: journey.icon || "🛍️",
        foundationId: journey.foundationId || "foundation-default",
        currentBranchId: "main",
        pages: journey.pages || ["page_home"],
        createdAt: now,
        updatedAt: now,
      };
      savedId = newJourney.id;
      updated = [newJourney, ...list];
    }

    StorageService.set(JOURNEYS_STORAGE_KEY, updated);
    return updated.find((j) => j.id === savedId) || null;
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter((j) => j.id !== id);
    StorageService.set(JOURNEYS_STORAGE_KEY, filtered);
    return filtered;
  },
};

export default JourneyRepository;

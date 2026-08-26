import { JourneyRepository } from "../repositories/journeyRepository.js";

export const JourneyService = {
  async getAllJourneys() {
    return JourneyRepository.getAll();
  },

  async getJourneyById(id) {
    const journey = await JourneyRepository.getById(id);
    if (!journey) {
      const error = new Error(`Journey with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "JOURNEY_NOT_FOUND";
      throw error;
    }
    return journey;
  },

  async createJourney(data) {
    if (!data.name) {
      const error = new Error("Journey name is required.");
      error.statusCode = 400;
      error.code = "VALIDATION_ERROR";
      throw error;
    }

    return JourneyRepository.create(data);
  },

  async updateJourney(id, data) {
    const existing = await JourneyRepository.getById(id);
    if (!existing) {
      const error = new Error(`Journey with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "JOURNEY_NOT_FOUND";
      throw error;
    }

    return JourneyRepository.update(id, data);
  },

  async deleteJourney(id) {
    const existing = await JourneyRepository.getById(id);
    if (!existing) {
      const error = new Error(`Journey with ID "${id}" not found.`);
      error.statusCode = 404;
      error.code = "JOURNEY_NOT_FOUND";
      throw error;
    }

    await JourneyRepository.delete(id);
    return { deletedId: id };
  },
};

export default JourneyService;

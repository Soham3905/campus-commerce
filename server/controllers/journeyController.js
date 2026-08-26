import { JourneyService } from "../services/journeyService.js";

export const JourneyController = {
  async getAll(req, res, next) {
    try {
      const data = await JourneyService.getAllJourneys();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await JourneyService.getJourneyById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const data = await JourneyService.createJourney(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const data = await JourneyService.updateJourney(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const data = await JourneyService.deleteJourney(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};

export default JourneyController;

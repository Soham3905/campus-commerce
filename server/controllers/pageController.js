import { PageService } from "../services/pageService.js";

export const PageController = {
  async getAll(req, res, next) {
    try {
      const data = await PageService.getAllPages(req.query.journeyId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await PageService.getPageById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const data = await PageService.createPage(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const data = await PageService.updatePage(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const data = await PageService.deletePage(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};

export default PageController;

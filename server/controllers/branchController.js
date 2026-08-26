import { BranchService } from "../services/branchService.js";

export const BranchController = {
  async getAll(req, res, next) {
    try {
      const data = await BranchService.getAllBranches(req.query.journeyId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await BranchService.getBranchById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const data = await BranchService.createBranch(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async updateSnapshot(req, res, next) {
    try {
      const { id, pageId } = req.params;
      const { schema } = req.body;
      const data = await BranchService.updateBranchSnapshot(id, pageId, schema);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const data = await BranchService.deleteBranch(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};

export default BranchController;

import { PullRequestService } from "../services/pullRequestService.js";

export const PullRequestController = {
  async getAll(req, res, next) {
    try {
      const data = await PullRequestService.getAll(req.query.journeyId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const data = await PullRequestService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const data = await PullRequestService.createPullRequest(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async approve(req, res, next) {
    try {
      const data = await PullRequestService.approvePullRequest(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async reject(req, res, next) {
    try {
      const data = await PullRequestService.rejectPullRequest(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async merge(req, res, next) {
    try {
      const data = await PullRequestService.mergePullRequest(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
};

export default PullRequestController;

import { Router } from "express";
import { PullRequestController } from "../controllers/pullRequestController.js";

const router = Router();

router.get("/", PullRequestController.getAll);
router.get("/:id", PullRequestController.getById);
router.post("/", PullRequestController.create);
router.patch("/:id/approve", PullRequestController.approve);
router.patch("/:id/reject", PullRequestController.reject);
router.patch("/:id/merge", PullRequestController.merge);

export default router;

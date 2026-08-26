import { Router } from "express";
import { BranchController } from "../controllers/branchController.js";

const router = Router();

router.get("/", BranchController.getAll);
router.get("/:id", BranchController.getById);
router.post("/", BranchController.create);
router.put("/:id/snapshots/:pageId", BranchController.updateSnapshot);
router.delete("/:id", BranchController.delete);

export default router;

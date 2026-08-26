import { Router } from "express";
import { PageController } from "../controllers/pageController.js";

const router = Router();

router.get("/", PageController.getAll);
router.get("/:id", PageController.getById);
router.post("/", PageController.create);
router.put("/:id", PageController.update);
router.delete("/:id", PageController.delete);

export default router;

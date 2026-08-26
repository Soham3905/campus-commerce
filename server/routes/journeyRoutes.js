import { Router } from "express";
import { JourneyController } from "../controllers/journeyController.js";

const router = Router();

router.get("/", JourneyController.getAll);
router.get("/:id", JourneyController.getById);
router.post("/", JourneyController.create);
router.put("/:id", JourneyController.update);
router.delete("/:id", JourneyController.delete);

export default router;

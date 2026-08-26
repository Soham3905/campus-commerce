import { Router } from "express";
import { ThemeController } from "../controllers/themeController.js";

const router = Router();

router.get("/", ThemeController.getAll);
router.get("/:id", ThemeController.getById);
router.post("/", ThemeController.create);
router.put("/:id", ThemeController.update);
router.delete("/:id", ThemeController.delete);

export default router;

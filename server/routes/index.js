import { Router } from "express";
import journeyRoutes from "./journeyRoutes.js";
import pageRoutes from "./pageRoutes.js";
import branchRoutes from "./branchRoutes.js";
import pullRequestRoutes from "./pullRequestRoutes.js";
import themeRoutes from "./themeRoutes.js";
import { InterfaceRepository } from "../repositories/interfaceRepository.js";

const router = Router();

// Domain API routes
router.use("/journeys", journeyRoutes);
router.use("/pages", pageRoutes);
router.use("/branches", branchRoutes);
router.use("/pull-requests", pullRequestRoutes);
router.use("/themes", themeRoutes);

// Interfaces endpoint
router.get("/interfaces", async (req, res, next) => {
  try {
    const data = await InterfaceRepository.getAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;

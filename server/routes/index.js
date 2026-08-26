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

// Demo state preservation (cart/wishlist demo)
let serverState = {
  cartCount: 3,
  wishlistCount: 2,
  favouritesCount: 1,
};

router.get("/state", (req, res) => {
  res.json(serverState);
});

router.post("/action", (req, res) => {
  const { actionName, payload } = req.body;
  const quantity = Number(payload?.quantity) || 1;
  if (actionName === "ADD_TO_CART") {
    serverState.cartCount += quantity;
  }
  if (actionName === "ADD_TO_WISHLIST") {
    serverState.wishlistCount += quantity;
  }
  if (actionName === "ADD_TO_FAVOURITE") {
    serverState.favouritesCount += quantity;
  }
  return res.json({
    ok: true,
    actionName,
    payload,
    state: serverState,
  });
});

export default router;

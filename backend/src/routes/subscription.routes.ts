import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getSubscriptionStatus,
  upgradePlan,
  syncSubscription,
} from "../controllers/subscription.controller";

const router = Router();

router.get("/status", authenticate, getSubscriptionStatus);
router.post("/upgrade", authenticate, upgradePlan);
router.post("/sync", authenticate, syncSubscription);

export default router;

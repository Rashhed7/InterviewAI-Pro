import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";
import {
  getDashboardStats,
  getUsers,
  updateUser,
  getSubscriptions,
  getPayments,
  getCoupons,
  createCoupon,
  getAIUsageStats,
  getFeatureLimits,
  updateFeatureLimits,
  getSupportTickets,
  sendAdminNotification,
  getActivityLogs,
  getSystemSettings,
  updateSystemSettings,
} from "../controllers/admin.controller";

const router = Router();

// Protect all admin endpoints with JWT authentication & ADMIN role authorization
router.use(authenticate);
router.use(requireAdmin);

router.get("/dashboard-stats", getDashboardStats);
router.get("/users", getUsers);
router.patch("/users/:userId", updateUser);
router.get("/subscriptions", getSubscriptions);
router.get("/payments", getPayments);
router.get("/coupons", getCoupons);
router.post("/coupons", createCoupon);
router.get("/ai-usage", getAIUsageStats);
router.get("/feature-limits", getFeatureLimits);
router.post("/feature-limits", updateFeatureLimits);
router.get("/support-tickets", getSupportTickets);
router.post("/notifications/send", sendAdminNotification);
router.get("/activity-logs", getActivityLogs);
router.get("/settings", getSystemSettings);
router.post("/settings", updateSystemSettings);

export default router;

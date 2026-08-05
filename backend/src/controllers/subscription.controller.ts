import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";

// In-memory subscription store fallback if Prisma database is not connected
const inMemorySubStore = new Map<string, any>();

export const getSubscriptionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id || "guest";
    const today = new Date().toISOString().split("T")[0];

    let sub = inMemorySubStore.get(userId) || {
      plan: "FREE",
      dailyInterviewCount: 0,
      dailyResumeCount: 0,
      dailyCodingCount: 0,
      lastResetDate: today,
    };

    if (sub.lastResetDate !== today) {
      sub.dailyInterviewCount = 0;
      sub.dailyResumeCount = 0;
      sub.dailyCodingCount = 0;
      sub.lastResetDate = today;
      inMemorySubStore.set(userId, sub);
    }

    return res.status(200).json({
      success: true,
      subscription: sub,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch subscription status",
    });
  }
};

export const upgradePlan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id || "guest";
    const { plan } = req.body;

    if (!["FREE", "PRO", "PREMIUM"].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type. Must be FREE, PRO, or PREMIUM.",
      });
    }

    const today = new Date().toISOString().split("T")[0];
    let sub = inMemorySubStore.get(userId) || {
      dailyInterviewCount: 0,
      dailyResumeCount: 0,
      dailyCodingCount: 0,
      lastResetDate: today,
    };

    sub.plan = plan;
    inMemorySubStore.set(userId, sub);

    return res.status(200).json({
      success: true,
      message: `Plan successfully upgraded to ${plan}`,
      subscription: sub,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upgrade plan",
    });
  }
};

export const syncSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id || "guest";
    const { plan, dailyInterviewCount, dailyResumeCount, dailyCodingCount, lastResetDate } = req.body;

    const sub = {
      plan: plan || "FREE",
      dailyInterviewCount: dailyInterviewCount || 0,
      dailyResumeCount: dailyResumeCount || 0,
      dailyCodingCount: dailyCodingCount || 0,
      lastResetDate: lastResetDate || new Date().toISOString().split("T")[0],
    };

    inMemorySubStore.set(userId, sub);

    return res.status(200).json({
      success: true,
      subscription: sub,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Sync failed",
    });
  }
};

import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import prisma from "../config/prisma";

export const getSubscriptionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        plan: true,
        freeInterviewCount: true,
        freeResumeCount: true,
        freeCodingCount: true,
        lastUsageReset: true,
      },
    });

    if (!dbUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const today = new Date().toISOString().split("T")[0];
    const lastReset = dbUser.lastUsageReset ? dbUser.lastUsageReset.toISOString().split("T")[0] : today;

    let interviewCount = dbUser.freeInterviewCount;
    let resumeCount = dbUser.freeResumeCount;
    let codingCount = dbUser.freeCodingCount;

    // Reset daily counts if lastUsageReset is before today
    if (lastReset !== today) {
      interviewCount = 0;
      resumeCount = 0;
      codingCount = 0;

      await prisma.user.update({
        where: { id: userId },
        data: {
          freeInterviewCount: 0,
          freeResumeCount: 0,
          freeCodingCount: 0,
          lastUsageReset: new Date(),
        },
      });
    }

    return res.status(200).json({
      success: true,
      subscription: {
        plan: dbUser.plan,
        dailyInterviewCount: interviewCount,
        dailyResumeCount: resumeCount,
        dailyCodingCount: codingCount,
        lastResetDate: today,
      },
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
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { plan } = req.body;

    if (!["FREE", "PRO", "PREMIUM"].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan type. Must be FREE, PRO, or PREMIUM.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { plan: plan as any },
    });

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await prisma.subscription.create({
      data: {
        userId,
        plan: plan as any,
        status: "ACTIVE",
        endDate,
      },
    });

    const today = new Date().toISOString().split("T")[0];

    return res.status(200).json({
      success: true,
      message: `Plan successfully upgraded to ${plan}`,
      subscription: {
        plan: updatedUser.plan,
        dailyInterviewCount: updatedUser.freeInterviewCount,
        dailyResumeCount: updatedUser.freeResumeCount,
        dailyCodingCount: updatedUser.freeCodingCount,
        lastResetDate: today,
      },
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
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { plan, dailyInterviewCount, dailyResumeCount, dailyCodingCount } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(plan && { plan: plan as any }),
        ...(dailyInterviewCount !== undefined && { freeInterviewCount: dailyInterviewCount }),
        ...(dailyResumeCount !== undefined && { freeResumeCount: dailyResumeCount }),
        ...(dailyCodingCount !== undefined && { freeCodingCount: dailyCodingCount }),
      },
    });

    const today = new Date().toISOString().split("T")[0];

    return res.status(200).json({
      success: true,
      subscription: {
        plan: updatedUser.plan,
        dailyInterviewCount: updatedUser.freeInterviewCount,
        dailyResumeCount: updatedUser.freeResumeCount,
        dailyCodingCount: updatedUser.freeCodingCount,
        lastResetDate: today,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Sync failed",
    });
  }
};

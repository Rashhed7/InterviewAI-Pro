import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const LIMITS: Record<string, { interviews: number; resume: number; coding: number }> = {
  FREE: { interviews: 3, resume: 3, coding: 5 },
  PRO: { interviews: Infinity, resume: Infinity, coding: Infinity },
  PREMIUM: { interviews: Infinity, resume: Infinity, coding: Infinity },
};

export const checkFeatureLimit = (featureType: "interviews" | "resume" | "coding") => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const plan = user.plan || "FREE";
      const limits = LIMITS[plan] || LIMITS.FREE;
      const maxAllowed = limits[featureType];

      let currentCount = 0;
      if (featureType === "interviews") currentCount = user.dailyInterviewCount || 0;
      if (featureType === "resume") currentCount = user.dailyResumeCount || 0;
      if (featureType === "coding") currentCount = user.dailyCodingCount || 0;

      if (plan === "FREE" && currentCount >= maxAllowed) {
        return res.status(403).json({
          success: false,
          limitExceeded: true,
          plan: "FREE",
          featureType,
          current: currentCount,
          limit: maxAllowed,
          message: `Daily ${featureType} limit reached for Free Plan. Upgrade to Pro for unlimited access.`,
        });
      }

      next();
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || "Subscription check failed" });
    }
  };
};

import { apiRequest } from "./api";
import { type PlanType, SUBSCRIPTION_LIMITS } from "../constants/subscription";

export interface UserSubscriptionData {
  plan: PlanType;
  dailyInterviewCount: number;
  dailyResumeCount: number;
  dailyCodingCount: number;
  lastResetDate: string; // ISO date string YYYY-MM-DD
}

const STORAGE_KEY = "userSubscription";

export const subscriptionService = {
  // Helper to format today's date YYYY-MM-DD
  getTodayDateString(): string {
    return new Date().toISOString().split("T")[0];
  },

  // Get current local/cached subscription data with auto daily reset logic
  getSubscription(): UserSubscriptionData {
    const today = this.getTodayDateString();
    const raw = localStorage.getItem(STORAGE_KEY);

    let sub: UserSubscriptionData = {
      plan: "FREE",
      dailyInterviewCount: 0,
      dailyResumeCount: 0,
      dailyCodingCount: 0,
      lastResetDate: today,
    };

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        sub = {
          plan: parsed.plan || "FREE",
          dailyInterviewCount: parsed.dailyInterviewCount || 0,
          dailyResumeCount: parsed.dailyResumeCount || 0,
          dailyCodingCount: parsed.dailyCodingCount || 0,
          lastResetDate: parsed.lastResetDate || today,
        };
      } catch (e) {}
    }

    // Auto reset counts if last reset date is before today
    if (sub.lastResetDate !== today) {
      sub.dailyInterviewCount = 0;
      sub.dailyResumeCount = 0;
      sub.dailyCodingCount = 0;
      sub.lastResetDate = today;
      this.saveSubscription(sub);
    }

    return sub;
  },

  saveSubscription(data: UserSubscriptionData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // Check feature limit before starting an action
  checkUsageLimit(featureType: "interviews" | "resume" | "coding"): {
    allowed: boolean;
    current: number;
    limit: number;
    plan: PlanType;
  } {
    const sub = this.getSubscription();
    const limits = SUBSCRIPTION_LIMITS[sub.plan];

    let current = 0;
    let limit = Infinity;

    if (featureType === "interviews") {
      current = sub.dailyInterviewCount;
      limit = limits.interviews;
    } else if (featureType === "resume") {
      current = sub.dailyResumeCount;
      limit = limits.resume;
    } else if (featureType === "coding") {
      current = sub.dailyCodingCount;
      limit = limits.coding;
    }

    const allowed = sub.plan !== "FREE" || current < limit;

    return {
      allowed,
      current,
      limit,
      plan: sub.plan,
    };
  },

  // Increment usage count for a feature
  incrementUsage(featureType: "interviews" | "resume" | "coding"): UserSubscriptionData {
    const sub = this.getSubscription();

    if (featureType === "interviews") {
      sub.dailyInterviewCount += 1;
    } else if (featureType === "resume") {
      sub.dailyResumeCount += 1;
    } else if (featureType === "coding") {
      sub.dailyCodingCount += 1;
    }

    this.saveSubscription(sub);

    // Sync usage to backend asynchronously
    this.syncSubscriptionToBackend(sub).catch(() => {});

    return sub;
  },

  // Update user plan
  async updatePlan(newPlan: PlanType): Promise<{ success: boolean; subscription: UserSubscriptionData }> {
    const sub = this.getSubscription();
    sub.plan = newPlan;
    this.saveSubscription(sub);

    try {
      const res = await apiRequest<{ success: boolean; subscription: UserSubscriptionData }>("/subscription/upgrade", {
        method: "POST",
        body: JSON.stringify({ plan: newPlan }),
      });
      if (res?.subscription) {
        this.saveSubscription(res.subscription);
        return res;
      }
    } catch (e) {
      // Local fallback for offline/preview
    }

    return { success: true, subscription: sub };
  },

  // Sync to backend
  async syncSubscriptionToBackend(subData?: UserSubscriptionData): Promise<{ success: boolean; subscription?: UserSubscriptionData }> {
    const data = subData || this.getSubscription();
    try {
      return await apiRequest<{ success: boolean; subscription?: UserSubscriptionData }>("/subscription/sync", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (e) {
      return { success: false };
    }
  },

  // Fetch status from backend
  async fetchSubscriptionFromBackend(): Promise<UserSubscriptionData> {
    try {
      const res = await apiRequest<{ success: boolean; subscription: UserSubscriptionData }>("/subscription/status", {
        method: "GET",
      });
      if (res?.success && res.subscription) {
        this.saveSubscription(res.subscription);
        return res.subscription;
      }
    } catch (e) {}

    return this.getSubscription();
  },
};

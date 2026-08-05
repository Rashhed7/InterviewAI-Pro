export type PlanType = "FREE" | "PRO" | "PREMIUM";

export interface PlanFeatureLimits {
  interviews: number;
  resume: number;
  coding: number;
}

export interface SubscriptionPlanDetails {
  id: PlanType;
  name: string;
  badgeColor: string;
  priceMonthly: number;
  priceYearly: number; // Annual total price
  billingMonthlyText: string;
  billingYearlyText: string;
  popular?: boolean;
  limits: PlanFeatureLimits;
  features: string[];
  ctaButtonText: {
    freeUser: string;
    currentUser: string;
    upgrade: string;
  };
}

export const SUBSCRIPTION_LIMITS: Record<PlanType, PlanFeatureLimits> = {
  FREE: {
    interviews: 3,
    resume: 3,
    coding: 5,
  },
  PRO: {
    interviews: Infinity,
    resume: Infinity,
    coding: Infinity,
  },
  PREMIUM: {
    interviews: Infinity,
    resume: Infinity,
    coding: Infinity,
  },
};

export const SUBSCRIPTION_PLANS: Record<PlanType, SubscriptionPlanDetails> = {
  FREE: {
    id: "FREE",
    name: "Free Plan",
    badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 warm:bg-[#eae3d2] warm:text-[#2c251e]",
    priceMonthly: 0,
    priceYearly: 0,
    billingMonthlyText: "₹0/month",
    billingYearlyText: "₹0/year",
    limits: SUBSCRIPTION_LIMITS.FREE,
    features: [
      "3 AI Interviews per day",
      "3 Resume Analyses per day",
      "5 Coding Problems per day",
      "Basic AI Feedback",
      "Limited Interview History",
      "Community Support",
    ],
    ctaButtonText: {
      freeUser: "Current Plan",
      currentUser: "Current Plan",
      upgrade: "Get Started",
    },
  },
  PRO: {
    id: "PRO",
    name: "Pro Plan",
    badgeColor: "bg-blue-500/10 text-blue-600 border border-blue-500/30 dark:bg-indigo-500/20 dark:text-indigo-400 warm:bg-amber-600/20 warm:text-amber-800",
    priceMonthly: 399,
    priceYearly: 3990, // Save ~17% (2 months free)
    billingMonthlyText: "₹399/month",
    billingYearlyText: "₹3,990/year (Save 17%)",
    popular: true,
    limits: SUBSCRIPTION_LIMITS.PRO,
    features: [
      "Unlimited AI Interviews",
      "Unlimited Resume Analysis",
      "Unlimited Coding Practice",
      "Voice Interview",
      "Camera Interview",
      "Company Specific Interviews",
      "Detailed AI Reports",
      "Export Reports as PDF",
      "Unlimited Interview History",
      "Advanced Analytics",
      "Priority AI Processing",
    ],
    ctaButtonText: {
      freeUser: "Upgrade to Pro",
      currentUser: "Current Plan",
      upgrade: "Upgrade to Pro",
    },
  },
  PREMIUM: {
    id: "PREMIUM",
    name: "Premium Plan",
    badgeColor: "bg-amber-500/15 text-amber-600 border border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400 warm:bg-amber-600/25 warm:text-amber-900",
    priceMonthly: 799,
    priceYearly: 7990, // Save ~17% (2 months free)
    billingMonthlyText: "₹799/month",
    billingYearlyText: "₹7,990/year (Save 17%)",
    limits: SUBSCRIPTION_LIMITS.PREMIUM,
    features: [
      "Everything in Pro plus",
      "AI Career Coach",
      "Personalized Learning Roadmap",
      "System Design Interviews",
      "Weekly Progress Reports",
      "Mock HR Interviews",
      "Priority Support",
      "Early Access Features",
    ],
    ctaButtonText: {
      freeUser: "Go Premium",
      currentUser: "Current Plan",
      upgrade: "Go Premium",
    },
  },
};

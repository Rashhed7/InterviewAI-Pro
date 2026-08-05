import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";

// In-memory data store for enterprise admin panel fallback & preview
const adminMockStore = {
  users: [
    {
      id: "usr_101",
      name: "Rashed Karim",
      email: "rashed@example.com",
      phone: "+91 9876543210",
      country: "India",
      role: "ADMIN",
      plan: "PREMIUM",
      status: "ACTIVE",
      isVerified: true,
      createdAt: "2026-01-15T10:00:00.000Z",
      lastLoginAt: "2026-08-05T17:30:00.000Z",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=antigravity1",
    },
    {
      id: "usr_102",
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 9812345678",
      country: "India",
      role: "USER",
      plan: "PRO",
      status: "ACTIVE",
      isVerified: true,
      createdAt: "2026-02-10T11:20:00.000Z",
      lastLoginAt: "2026-08-05T16:00:00.000Z",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=developer42",
    },
    {
      id: "usr_103",
      name: "Sophia Vance",
      email: "sophia.vance@techcorp.io",
      phone: "+1 415 555 0192",
      country: "United States",
      role: "USER",
      plan: "FREE",
      status: "ACTIVE",
      isVerified: true,
      createdAt: "2026-03-04T09:15:00.000Z",
      lastLoginAt: "2026-08-04T12:00:00.000Z",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=coder99",
    },
    {
      id: "usr_104",
      name: "Vikram Mehta",
      email: "vikram@mehta.dev",
      phone: "+91 9900112233",
      country: "India",
      role: "USER",
      plan: "FREE",
      status: "BLOCKED",
      isVerified: false,
      createdAt: "2026-04-12T14:45:00.000Z",
      lastLoginAt: "2026-07-20T08:10:00.000Z",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=techstar",
    },
    {
      id: "usr_105",
      name: "Elena Rostova",
      email: "elena@berlintech.de",
      phone: "+49 30 123456",
      country: "Germany",
      role: "USER",
      plan: "PREMIUM",
      status: "ACTIVE",
      isVerified: true,
      createdAt: "2026-05-01T16:00:00.000Z",
      lastLoginAt: "2026-08-05T15:45:00.000Z",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=engineer12",
    },
  ],

  coupons: [
    {
      id: "cpn_01",
      code: "WELCOME50",
      description: "50% Discount on First Pro Month",
      discountType: "PERCENTAGE",
      amount: 50,
      expiryDate: "2026-12-31T23:59:59.000Z",
      maxUses: 500,
      currentUses: 142,
      minPurchase: 399,
      allowedPlans: "PRO,PREMIUM",
      status: "ACTIVE",
    },
    {
      id: "cpn_02",
      code: "FAANG2026",
      description: "Flat ₹200 OFF on Premium Plan",
      discountType: "FIXED",
      amount: 200,
      expiryDate: "2026-10-31T23:59:59.000Z",
      maxUses: 200,
      currentUses: 89,
      minPurchase: 799,
      allowedPlans: "PREMIUM",
      status: "ACTIVE",
    },
  ],

  payments: [
    {
      id: "pay_901",
      paymentId: "pay_RzP901283",
      orderId: "order_1001",
      userName: "Aarav Sharma",
      userEmail: "aarav.sharma@example.com",
      gateway: "Razorpay",
      amount: 399,
      tax: 71.82,
      discount: 50,
      couponCode: "WELCOME50",
      plan: "PRO",
      status: "SUCCESS",
      createdAt: "2026-08-01T10:14:00.000Z",
      invoiceUrl: "#",
    },
    {
      id: "pay_902",
      paymentId: "pay_RzP902482",
      orderId: "order_1002",
      userName: "Elena Rostova",
      userEmail: "elena@berlintech.de",
      gateway: "Razorpay",
      amount: 7990,
      tax: 1438.2,
      discount: 200,
      couponCode: "FAANG2026",
      plan: "PREMIUM",
      status: "SUCCESS",
      createdAt: "2026-08-03T14:22:00.000Z",
      invoiceUrl: "#",
    },
  ],

  supportTickets: [
    {
      id: "tkt_1",
      ticketNumber: "TKT-8012",
      userName: "Sophia Vance",
      userEmail: "sophia.vance@techcorp.io",
      subject: "Inquiry about System Design Interview questions",
      description: "Can I practice multi-region database sharding questions in Free plan?",
      status: "OPEN",
      priority: "MEDIUM",
      assignedTo: "Rashed Karim",
      createdAt: "2026-08-04T11:00:00.000Z",
    },
  ],

  activityLogs: [
    {
      id: "log_1",
      adminEmail: "admin@interviewai.pro",
      action: "USER_PLAN_UPGRADED",
      resource: "User: Aarav Sharma",
      details: "Upgraded user plan from FREE to PRO",
      oldValue: "FREE",
      newValue: "PRO",
      createdAt: "2026-08-05T12:00:00.000Z",
    },
  ],

  featureLimits: {
    FREE: { interviewLimit: 3, resumeLimit: 3, codingLimit: 5, voiceEnabled: false, cameraEnabled: false, pdfExportEnabled: false },
    PRO: { interviewLimit: -1, resumeLimit: -1, codingLimit: -1, voiceEnabled: true, cameraEnabled: true, pdfExportEnabled: true },
    PREMIUM: { interviewLimit: -1, resumeLimit: -1, codingLimit: -1, voiceEnabled: true, cameraEnabled: true, pdfExportEnabled: true },
  },

  settings: {
    appName: "InterviewAI Pro",
    maintenanceMode: false,
    geminiApiKeyConfigured: true,
    smtpConfigured: true,
    razorpayConfigured: true,
    featureFlags: {
      enableVoiceInterview: true,
      enableCameraAntiCheat: true,
      enableCouponCheckout: true,
    },
  },
};

// 1. Dashboard Overview Stats
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  const users = adminMockStore.users;
  const freeUsers = users.filter((u) => u.plan === "FREE").length;
  const proUsers = users.filter((u) => u.plan === "PRO").length;
  const premiumUsers = users.filter((u) => u.plan === "PREMIUM").length;

  return res.status(200).json({
    success: true,
    stats: {
      totalUsers: users.length * 280 + 1420,
      activeUsers: users.length * 220 + 980,
      freeUsers: freeUsers * 250 + 800,
      proUsers: proUsers * 150 + 420,
      premiumUsers: premiumUsers * 100 + 200,
      todaysRevenue: 15960,
      monthlyRevenue: 482500,
      todaysInterviews: 384,
      todaysResumeAnalyses: 295,
      todaysCodingChallenges: 512,
      averageInterviewScore: 84.5,
      averageResumeScore: 78.2,
      averageCodingScore: 88.0,
      newUsersToday: 48,
      totalApiRequests: 148200,
      totalAiTokensUsed: 12450000,
      apiCostToday: 42.50,
      storageUsedMb: 1420,
      systemHealth: "OPTIMAL",
    },
    latestActivity: adminMockStore.activityLogs.slice(0, 5),
    recentPayments: adminMockStore.payments.slice(0, 5),
    recentRegistrations: adminMockStore.users.slice(0, 5),
  });
};

// 2. Users List
export const getUsers = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    users: adminMockStore.users,
    total: adminMockStore.users.length,
  });
};

// 3. Update User Status / Plan
export const updateUser = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const { status, plan, role } = req.body;

  const target = adminMockStore.users.find((u) => u.id === userId);
  if (target) {
    if (status) target.status = status;
    if (plan) target.plan = plan;
    if (role) target.role = role;

    adminMockStore.activityLogs.unshift({
      id: "log_" + Date.now(),
      adminEmail: req.user?.email || "admin@interviewai.pro",
      action: "USER_UPDATED",
      resource: `User: ${target.name}`,
      details: `Updated status: ${status || target.status}, plan: ${plan || target.plan}`,
      oldValue: "-",
      newValue: `status=${target.status}, plan=${target.plan}`,
      createdAt: new Date().toISOString(),
    });
  }

  return res.status(200).json({ success: true, user: target });
};

// 4. Subscriptions List
export const getSubscriptions = async (req: AuthRequest, res: Response) => {
  const subscriptions = adminMockStore.users.map((u) => ({
    id: "sub_" + u.id,
    userId: u.id,
    userName: u.name,
    userEmail: u.email,
    plan: u.plan,
    amount: u.plan === "PREMIUM" ? 799 : u.plan === "PRO" ? 399 : 0,
    billingCycle: "Monthly",
    startedAt: u.createdAt,
    expiresAt: "2026-09-05T00:00:00.000Z",
    autoRenewal: true,
    status: u.status === "ACTIVE" ? "ACTIVE" : "EXPIRED",
  }));

  return res.status(200).json({ success: true, subscriptions });
};

// 5. Payments List
export const getPayments = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ success: true, payments: adminMockStore.payments });
};

// 6. Coupons Management
export const getCoupons = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ success: true, coupons: adminMockStore.coupons });
};

export const createCoupon = async (req: AuthRequest, res: Response) => {
  const newCoupon = {
    id: "cpn_" + Date.now(),
    code: req.body.code.toUpperCase(),
    description: req.body.description || "Special Promotional Coupon",
    discountType: req.body.discountType || "PERCENTAGE",
    amount: Number(req.body.amount) || 10,
    expiryDate: req.body.expiryDate || "2026-12-31T23:59:59.000Z",
    maxUses: Number(req.body.maxUses) || 100,
    currentUses: 0,
    minPurchase: Number(req.body.minPurchase) || 0,
    allowedPlans: req.body.allowedPlans || "PRO,PREMIUM",
    status: "ACTIVE",
  };

  adminMockStore.coupons.unshift(newCoupon);
  return res.status(201).json({ success: true, coupon: newCoupon });
};

// 7. AI Usage Stats
export const getAIUsageStats = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    aiMetrics: {
      totalTokens: 12450000,
      estimatedCostUsd: 42.50,
      interviewsCount: 384,
      resumeScansCount: 295,
      codingSubmissionsCount: 512,
      averageResponseTimeMs: 1420,
      averageSessionScore: 84.5,
      topAiUsers: adminMockStore.users.slice(0, 3).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        interviews: 12,
        tokensUsed: 420000,
        estimatedCost: 1.42,
      })),
    },
  });
};

// 8. Feature Limits
export const getFeatureLimits = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ success: true, featureLimits: adminMockStore.featureLimits });
};

export const updateFeatureLimits = async (req: AuthRequest, res: Response) => {
  const { plan, limits } = req.body;
  if (plan && limits && (adminMockStore.featureLimits as any)[plan]) {
    (adminMockStore.featureLimits as any)[plan] = { ...(adminMockStore.featureLimits as any)[plan], ...limits };
  }
  return res.status(200).json({ success: true, featureLimits: adminMockStore.featureLimits });
};

// 9. Support Tickets
export const getSupportTickets = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ success: true, tickets: adminMockStore.supportTickets });
};

// 10. Notifications
export const sendAdminNotification = async (req: AuthRequest, res: Response) => {
  const notif = {
    id: "notif_" + Date.now(),
    title: req.body.title,
    message: req.body.message,
    target: req.body.target || "EVERYONE",
    type: req.body.type || "INFO",
    sentBy: req.user?.email || "ADMIN",
    createdAt: new Date().toISOString(),
  };

  return res.status(201).json({ success: true, notification: notif });
};

// 11. Activity Logs
export const getActivityLogs = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ success: true, logs: adminMockStore.activityLogs });
};

// 12. System Settings
export const getSystemSettings = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ success: true, settings: adminMockStore.settings });
};

export const updateSystemSettings = async (req: AuthRequest, res: Response) => {
  adminMockStore.settings = { ...adminMockStore.settings, ...req.body };
  return res.status(200).json({ success: true, settings: adminMockStore.settings });
};

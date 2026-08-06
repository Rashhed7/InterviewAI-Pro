import { Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import prisma, { withDbRetry } from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sendPaymentSuccessEmail } from "../services/email.service";

// Initialize Razorpay client dynamically helper
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || "";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "";

  if (!key_id || key_id.includes("YOUR_KEY_ID")) {
    throw new Error("Razorpay Key ID is not configured in backend/.env");
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// Plan Pricing Configuration (Prices in INR)
const PLAN_PRICES: Record<string, number> = {
  PRO: 499,
  PREMIUM: 999,
};

// 1. Create Razorpay Order & Insert PENDING Payment Record
export const createPaymentOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please sign in." });
    }

    const { plan = "PRO" } = req.body;
    const targetPlan = String(plan).toUpperCase();

    if (!["PRO", "PREMIUM"].includes(targetPlan)) {
      return res.status(400).json({ success: false, message: "Invalid target plan. Must be PRO or PREMIUM." });
    }

    const priceInINR = PLAN_PRICES[targetPlan] || 499;
    const amountInPaise = priceInINR * 100; // Razorpay expects amount in paise

    const razorpay = getRazorpayInstance();

    // Create Razorpay Order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${userId.substring(0, 8)}_${Date.now()}`,
      notes: {
        userId,
        plan: targetPlan,
      },
    };

    const order = await razorpay.orders.create(options);

    // Save initial Payment record in Neon DB with status: PENDING
    await withDbRetry(async () => {
      await prisma.payment.create({
        data: {
          userId,
          amount: priceInINR,
          currency: "INR",
          provider: "RAZORPAY",
          razorpayOrderId: order.id,
          receiptId: options.receipt,
          plan: targetPlan as any,
          status: "PENDING", // EXACT REQUIREMENT: PENDING before payment
        },
      });
    });

    console.log(`💳 [PAYMENT ORDER CREATED] Order ID: ${order.id} for User: ${userId} (${targetPlan} Plan) - Status: PENDING`);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      plan: targetPlan,
    });
  } catch (error: any) {
    console.error("⚠️ Error creating payment order:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay payment order",
    });
  }
};

// 2. Verify Razorpay Payment Signature & Upgrade User Plan (ZERO-TRUST SECURITY)
export const verifyPaymentSignature = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please sign in." });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay verification parameters (order_id, payment_id, signature).",
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    // Compute HMAC SHA256 Signature for Verification
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Zero-Trust Check: Compare generated signature with Razorpay signature
    if (generatedSignature !== razorpay_signature) {
      console.error(`🚨 [PAYMENT VERIFICATION FAILED] Signature Mismatch for Order: ${razorpay_order_id}`);

      // Mark payment status as FAILED in DB
      await withDbRetry(async () => {
        await prisma.payment.updateMany({
          where: { razorpayOrderId: razorpay_order_id },
          data: { status: "FAILED" },
        });
      });

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Payment verification failed.",
      });
    }

    // Signature VERIFIED SUCCESSFULLY -> Update DB Records
    const result = await withDbRetry(async () => {
      // 1. Fetch pending payment record
      const paymentRecord = await prisma.payment.findFirst({
        where: { razorpayOrderId: razorpay_order_id },
      });

      const targetPlan = paymentRecord?.plan || "PRO";

      // 2. Update Payment table status to SUCCESS
      const updatedPayment = await prisma.payment.updateMany({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          status: "SUCCESS", // EXACT REQUIREMENT: SUCCESS after payment
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paidAt: new Date(),
        },
      });

      // 3. Update User table plan to PRO (or target plan)
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          plan: targetPlan as any, // EXACT REQUIREMENT: plan = PRO
        },
      });

      // 4. Create/Update Subscription table to ACTIVE
      const startDate = new Date();
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days subscription

      // Deactivate older active subscriptions
      await prisma.subscription.updateMany({
        where: { userId, status: "ACTIVE" },
        data: { status: "EXPIRED" },
      });

      const subscription = await prisma.subscription.create({
        data: {
          userId,
          plan: targetPlan as any,
          status: "ACTIVE", // EXACT REQUIREMENT: status = ACTIVE
          startDate,
          endDate,
          razorpaySubscriptionId: razorpay_order_id,
        },
      });

      return { user: updatedUser, subscription, paymentRecord };
    });

    console.log(`🎉 [PAYMENT SUCCESS] User ${userId} upgraded to ${result.user.plan} Plan!`);

    // Send greeting & payment receipt email to user
    sendPaymentSuccessEmail(
      result.user.email,
      result.user.name,
      result.user.plan,
      result.paymentRecord?.amount || (result.user.plan === "PREMIUM" ? 999 : 499),
      razorpay_payment_id
    ).catch((err) => console.error("⚠️ Failed to send payment confirmation email:", err));

    return res.status(200).json({
      success: true,
      message: `Payment verified successfully! Your account has been upgraded to ${result.user.plan}.`,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        plan: result.user.plan,
      },
      subscription: result.subscription,
    });
  } catch (error: any) {
    console.error("⚠️ Error verifying payment signature:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment signature",
    });
  }
};

// 3. Fetch User Payment History
export const getPaymentHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const history = await withDbRetry(async () => {
      return await prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    });

    return res.status(200).json({
      success: true,
      payments: history,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch payment history",
    });
  }
};

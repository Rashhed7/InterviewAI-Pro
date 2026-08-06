import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createPaymentOrder,
  verifyPaymentSignature,
  getPaymentHistory,
} from "../controllers/payment.controller";

const router = Router();

// Create Razorpay Order & Register PENDING Payment Record in Neon DB
router.post("/create-order", authenticate, createPaymentOrder);

// Verify Razorpay Payment Signature, Mark Payment SUCCESS, and Upgrade User to PRO (Zero-Trust)
router.post("/verify-payment", authenticate, verifyPaymentSignature);

// Get User Payment Transaction Logs
router.get("/history", authenticate, getPaymentHistory);

export default router;

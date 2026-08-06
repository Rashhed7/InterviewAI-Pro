import { Router } from "express";
import {
  register,
  login,
  profile,
  verifyEmailController,
  resendOTPController,
  socialLoginController,
  googleRedirect,
  googleCallback,
  githubRedirect,
  githubCallback,
  getAllUsersController,
  forgotPasswordController,
  resetPasswordController,
  updateProfileController,
  changePasswordController,
  deleteAccountController,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.post("/social", socialLoginController);

// OAuth Social Routes
router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);
router.get("/github", githubRedirect);
router.get("/github/callback", githubCallback);

// OTP Email Verification Routes
router.post("/verify-email", verifyEmailController);
router.post("/resend-otp", resendOTPController);

// Password Reset Routes
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

// Authenticated User Profile & Account Routes
router.get("/profile", authenticate, profile);
router.get("/me", authenticate, profile);
router.put("/profile", authenticate, updateProfileController);
router.post("/change-password", authenticate, changePasswordController);
router.delete("/account", authenticate, deleteAccountController);

// Developer View Accounts Route
router.get("/developer/users", getAllUsersController);

export default router;
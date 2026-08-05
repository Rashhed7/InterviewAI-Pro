import { Router } from "express";
import { sendVerificationEmail, sendCongratulationEmail } from "../services/email.service";

const router = Router();

router.get("/test", async (req, res) => {
  try {
    await sendVerificationEmail(
      "rasheedabdulrasheed44@gmail.com",
      "Test User",
      "123456"
    );

    res.json({
      success: true,
      message: "Verification Email Sent Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

router.get("/test-welcome", async (req, res) => {
  try {
    await sendCongratulationEmail(
      "rasheedabdulrasheed44@gmail.com",
      "Test User"
    );

    res.json({
      success: true,
      message: "Congratulations Welcome Email Sent Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send welcome email",
    });
  }
});

export default router;
import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendOTP,
  socialLogin,
  getAllUsers,
  getUserById,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
} from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";

// ================= REGISTER =================

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const user = await registerUser(name, email, password);

    return res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for the verification code.",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

// ================= LOGIN =================

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

// ================= VERIFY EMAIL =================

export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP code are required.",
      });
    }

    const result = await verifyEmail(email, otp);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Verification failed",
    });
  }
};

// ================= RESEND OTP =================

export const resendOTPController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const result = await resendOTP(email);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to resend OTP",
    });
  }
};

// ================= SOCIAL LOGIN =================

export const socialLoginController = async (req: Request, res: Response) => {
  try {
    const { provider, name, email } = req.body;

    if (!provider || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Provider, name, and email are required for social login.",
      });
    }

    const result = await socialLogin(provider, name, email);

    return res.status(200).json({
      success: true,
      message: `${provider} login successful!`,
      ...result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Social login failed",
    });
  }
};

// --- GOOGLE OAUTH HANDLERS ---
export const googleRedirect = (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

  if (!clientId || clientId.includes("YOUR_GOOGLE_CLIENT_ID")) {
    return res.status(400).send("Google Client ID is not configured. Please set GOOGLE_CLIENT_ID in backend/.env.");
  }

  const redirectUri = `${backendUrl}/api/auth/google/callback`;
  const scope = encodeURIComponent("email profile");
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&prompt=select_account`;

  return res.redirect(googleAuthUrl);
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=Google authentication failed`);
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: `${backendUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error(tokenData.error_description || "Failed to retrieve access token from Google");
    }

    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userResponse.json();
    const email = googleUser.email;
    const name = googleUser.name || email.split("@")[0];

    const result = await socialLogin("google", name, email);
    const userJson = encodeURIComponent(JSON.stringify(result.user));

    return res.redirect(`${frontendUrl}/auth/callback?token=${result.token}&user=${userJson}`);
  } catch (error: any) {
    console.error("Google OAuth Error:", error);
    const userMsg = error?.message?.includes("Can't reach database")
      ? "Database connection warming up. Please click Google login again."
      : (error.message && !error.message.includes("invocation") ? error.message : "Google authentication failed. Please try again.");
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(userMsg)}`);
  }
};

// --- GITHUB OAUTH HANDLERS ---
export const githubRedirect = (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

  if (!clientId || clientId.includes("YOUR_GITHUB_CLIENT_ID")) {
    return res.status(400).send("GitHub Client ID is not configured. Please set GITHUB_CLIENT_ID in backend/.env.");
  }

  const redirectUri = `${backendUrl}/api/auth/github/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;

  return res.redirect(githubAuthUrl);
};

export const githubCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=GitHub authentication failed`);
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID || "",
        client_secret: process.env.GITHUB_CLIENT_SECRET || "",
        code: String(code),
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error(tokenData.error_description || "Failed to retrieve access token from GitHub");
    }

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "InterviewAI-Pro",
      },
    });

    const githubUser = await userResponse.json();
    let email = githubUser.email;

    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "InterviewAI-Pro",
        },
      });
      const emails = await emailResponse.json();
      if (Array.isArray(emails) && emails.length > 0) {
        const primary = emails.find((e: any) => e.primary) || emails[0];
        email = primary.email;
      }
    }

    const name = githubUser.name || githubUser.login || (email ? email.split("@")[0] : "GitHub User");
    if (!email) {
      email = `${githubUser.login}@users.noreply.github.com`;
    }

    const result = await socialLogin("github", name, email);
    const userJson = encodeURIComponent(JSON.stringify(result.user));

    return res.redirect(`${frontendUrl}/auth/callback?token=${result.token}&user=${userJson}`);
  } catch (error: any) {
    console.error("GitHub OAuth Error:", error);
    const userMsg = error?.message?.includes("Can't reach database")
      ? "Database connection warming up. Please click GitHub login again."
      : (error.message && !error.message.includes("invocation") ? error.message : "GitHub authentication failed. Please try again.");
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(userMsg)}`);
  }
};

// ================= FORGOT PASSWORD =================

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    const result = await forgotPassword(email);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to process request",
    });
  }
};

// ================= RESET PASSWORD =================

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP code, and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const result = await resetPassword(email, otp, newPassword);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
};

// ================= DEVELOPER USERS =================

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

// ================= PROFILE =================

export const profile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await getUserById(userId);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to get profile",
    });
  }
};

// ================= UPDATE PROFILE =================

export const updateProfileController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, avatar } = req.body;
    const updatedUser = await updateUserProfile(userId, name, avatar);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

// ================= CHANGE PASSWORD =================

export const changePasswordController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const result = await changePassword(userId, currentPassword, newPassword);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to change password",
    });
  }
};

// ================= DELETE ACCOUNT =================

export const deleteAccountController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await deleteUserAccount(userId);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete account",
    });
  }
};
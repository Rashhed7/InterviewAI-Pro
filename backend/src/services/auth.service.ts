import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utils/generateOTP";
import {
  sendVerificationEmail,
  sendCongratulationEmail,
  sendResetPasswordEmail,
} from "./email.service";

const JWT_SECRET = process.env.JWT_SECRET || "interview_ai_pro_super_secret_jwt_key_2026";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verificationToken: otp,
      verificationExpiry: expiry,
    },
  });

  await sendVerificationEmail(email, name, otp);

  const { password: _, ...safeUser } = user;
  return safeUser;
};

// ====================== LOGIN ======================

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const { password: _, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
};

// ====================== VERIFY EMAIL ======================

export const verifyEmail = async (
  email: string,
  otp: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email already verified");
  }

  if (user.verificationToken !== otp) {
    throw new Error("Invalid verification OTP");
  }

  if (!user.verificationExpiry || user.verificationExpiry < new Date()) {
    throw new Error("OTP has expired. Please request a new code.");
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationExpiry: null,
    },
  });

  // Send congratulations email to the newly verified user
  await sendCongratulationEmail(updatedUser.email, updatedUser.name);

  const token = jwt.sign(
    { userId: updatedUser.id, email: updatedUser.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const { password: _, ...safeUser } = updatedUser;

  return {
    success: true,
    message: "Email verified successfully!",
    token,
    user: safeUser,
  };
};

// ====================== RESEND OTP ======================

export const resendOTP = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email is already verified.");
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      verificationToken: otp,
      verificationExpiry: expiry,
    },
  });

  await sendVerificationEmail(email, user.name, otp);

  return {
    success: true,
    message: "Verification code sent to your email.",
  };
};

// ====================== SOCIAL LOGIN ======================

export const socialLogin = async (
  provider: "google" | "github",
  name: string,
  email: string
) => {
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Create new user for social login
    const randomPass = await bcrypt.hash(Math.random().toString(36), 10);
    user = await prisma.user.create({
      data: {
        name,
        email,
        password: randomPass,
        isVerified: true,
        provider,
      },
    });
  } else if (!user.isVerified) {
    // Mark as verified if logging in via social provider
    user = await prisma.user.update({
      where: { email },
      data: { isVerified: true, provider },
    });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const { password: _, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
};

// ====================== DEVELOPER / ADMIN LIST ALL USERS ======================

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      isVerified: true,
      provider: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return users;
};

// ====================== GET USER PROFILE ======================

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      isVerified: true,
      provider: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// ====================== FORGOT PASSWORD ======================

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Account with this email address was not found.");
  }

  const resetOtp = generateOTP();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

  await prisma.user.update({
    where: { email },
    data: {
      resetPasswordToken: resetOtp,
      resetPasswordExpiry: expiry,
    },
  });

  await sendResetPasswordEmail(email, user.name, resetOtp);

  return {
    success: true,
    message: "Password reset code sent to your email.",
  };
};

// ====================== RESET PASSWORD ======================

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.resetPasswordToken || user.resetPasswordToken !== otp) {
    throw new Error("Invalid password reset code.");
  }

  if (!user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
    throw new Error("Password reset code has expired. Please request a new code.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });

  return {
    success: true,
    message: "Password reset successfully! You can now log in with your new password.",
  };
};

// ====================== UPDATE PROFILE ======================

export const updateUserProfile = async (
  userId: string,
  name?: string,
  avatar?: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(avatar !== undefined && { avatar }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      isVerified: true,
      provider: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// ====================== CHANGE PASSWORD ======================

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Current password is incorrect.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });

  return {
    success: true,
    message: "Password changed successfully!",
  };
};

// ====================== DELETE USER ACCOUNT ======================

export const deleteUserAccount = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User account not found");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return {
    success: true,
    message: "Account deleted successfully",
  };
};
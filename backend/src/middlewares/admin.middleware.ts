import { Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "./auth.middleware";

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided.",
      });
    }

    // Query database directly to get the updated role
    const userId = user.userId || user.id;
    let role = user.role;

    if (userId) {
      const dbUser = await prisma.user.findUnique({ where: { id: userId } }).catch(() => null);
      if (dbUser) {
        role = dbUser.role;
      }
    }

    // Check if user role is ADMIN (case-insensitive) or matches admin email
    const roleUpper = (role || "").toString().toUpperCase();
    const isAdminRole =
      roleUpper === "ADMIN" ||
      user.email === "admin@interviewai.pro" ||
      user.email === "admin@gmail.com";

    if (!isAdminRole) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin privileges required to access this resource.",
      });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Admin authorization failed",
    });
  }
};

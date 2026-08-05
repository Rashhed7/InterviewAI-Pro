import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const requireAdmin = (
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

    // Check if user role is ADMIN (or email matches admin credential)
    const isAdminRole = user.role === "ADMIN" || user.email === "admin@interviewai.pro" || user.email === "admin@gmail.com";

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

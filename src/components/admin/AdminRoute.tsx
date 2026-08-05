import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { adminService } from "../../services/adminService";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!adminService.isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

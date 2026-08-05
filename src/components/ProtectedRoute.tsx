import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

interface Props {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: Props) {
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
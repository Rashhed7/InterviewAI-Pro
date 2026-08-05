import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AIInterview from "./pages/AIInterview";
import CodingChallenge from "./pages/CodingChallenge";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import InterviewHistory from "./pages/InterviewHistory";
import Analytics from "./pages/Analytics";
import Leaderboard from "./pages/Leaderboard";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },

  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },

  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/ai-interview",
    element: (
      <ProtectedRoute>
        <AIInterview />
      </ProtectedRoute>
    ),
  },

  {
    path: "/coding-challenge",
    element: (
      <ProtectedRoute>
        <CodingChallenge />
      </ProtectedRoute>
    ),
  },

  {
    path: "/resume-analyzer",
    element: (
      <ProtectedRoute>
        <ResumeAnalyzer />
      </ProtectedRoute>
    ),
  },

  {
    path: "/interview-history",
    element: (
      <ProtectedRoute>
        <InterviewHistory />
      </ProtectedRoute>
    ),
  },

  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    ),
  },

  {
    path: "/leaderboard",
    element: (
      <ProtectedRoute>
        <Leaderboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },

  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },

  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-2xl">
        404 | Page Not Found
      </div>
    ),
  },
]);

export default router;
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
import Pricing from "./pages/Pricing";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { PageTransition } from "./components/layout/PageTransition";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PageTransition>
        <App />
      </PageTransition>
    ),
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <PageTransition>
          <Login />
        </PageTransition>
      </PublicRoute>
    ),
  },

  {
    path: "/register",
    element: (
      <PublicRoute>
        <PageTransition>
          <Register />
        </PageTransition>
      </PublicRoute>
    ),
  },

  {
    path: "/verify-email",
    element: (
      <PageTransition>
        <VerifyEmail />
      </PageTransition>
    ),
  },

  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <PageTransition>
          <ForgotPassword />
        </PageTransition>
      </PublicRoute>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <Dashboard />
        </PageTransition>
      </ProtectedRoute>
    ),
  },

  {
    path: "/ai-interview",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <AIInterview />
        </PageTransition>
      </ProtectedRoute>
    ),
  },

  {
    path: "/coding-challenge",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <CodingChallenge />
        </PageTransition>
      </ProtectedRoute>
    ),
  },

  {
    path: "/resume-analyzer",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <ResumeAnalyzer />
        </PageTransition>
      </ProtectedRoute>
    ),
  },

  {
    path: "/interview-history",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <InterviewHistory />
        </PageTransition>
      </ProtectedRoute>
    ),
  },

  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <Analytics />
        </PageTransition>
      </ProtectedRoute>
    ),
  },

  {
    path: "/leaderboard",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <Leaderboard />
        </PageTransition>
      </ProtectedRoute>
    ),
  },

  {
    path: "/pricing",
    element: (
      <PageTransition>
        <Pricing />
      </PageTransition>
    ),
  },

  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <Profile />
        </PageTransition>
      </ProtectedRoute>
    ),
  },

  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <PageTransition>
          <Settings />
        </PageTransition>
      </ProtectedRoute>
    ),
  },

  {
    path: "*",
    element: (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-2xl font-bold">
          404 | Page Not Found
        </div>
      </PageTransition>
    ),
  },
]);

export default router;
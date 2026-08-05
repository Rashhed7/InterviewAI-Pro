import { apiRequest } from "./api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  provider?: string;
  authProvider?: "local" | "google" | "github";
  avatar?: string;
  role?: "user" | "admin";
  createdAt?: string;
}

export interface AuthResponse {
  success?: boolean;
  message: string;
  token?: string;
  user?: UserProfile;
}

export const authService = {
  // ================= LOGIN =================
  async login(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    if (data.user) {
      // Normalize isVerified & isEmailVerified
      const user = {
        ...data.user,
        isEmailVerified: data.user.isVerified ?? data.user.isEmailVerified ?? false,
      };
      localStorage.setItem("user", JSON.stringify(user));
    }

    return data;
  },

  // ================= REGISTER =================
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    return await apiRequest<AuthResponse>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );
  },

  // ================= SOCIAL LOGIN =================
  async socialLogin(
    provider: "google" | "github",
    name: string,
    email: string
  ): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>("/auth/social", {
      method: "POST",
      body: JSON.stringify({ provider, name, email }),
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    if (data.user) {
      const user = {
        ...data.user,
        isEmailVerified: data.user.isVerified ?? data.user.isEmailVerified ?? true,
      };
      localStorage.setItem("user", JSON.stringify(user));
    }

    return data;
  },

  // ================= VERIFY EMAIL =================
  async verifyEmailOTP(
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string; user?: UserProfile; token?: string }> {
    const data = await apiRequest<{
      success: boolean;
      message: string;
      user?: UserProfile;
      token?: string;
    }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({
        email,
        otp,
      }),
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    if (data.user) {
      const user = {
        ...data.user,
        isEmailVerified: true,
      };
      localStorage.setItem("user", JSON.stringify(user));
    }

    return data;
  },

  // ================= FORGOT PASSWORD =================
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return await apiRequest<{ success: boolean; message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // ================= RESET PASSWORD =================
  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    return await apiRequest<{ success: boolean; message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },

  // ================= RESEND OTP =================
  async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
    return await apiRequest<{ success: boolean; message: string }>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // ================= DEVELOPER VIEW USERS =================
  async getDeveloperUsers(): Promise<{ success: boolean; users: UserProfile[] }> {
    return await apiRequest<{ success: boolean; users: UserProfile[] }>("/auth/developer/users", {
      method: "GET",
    });
  },

  // ================= UPDATE PROFILE =================
  async updateProfile(name?: string, avatar?: string): Promise<{ success: boolean; message: string; user: UserProfile }> {
    const data = await apiRequest<{ success: boolean; message: string; user: UserProfile }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ name, avatar }),
    });

    if (data.user) {
      const user = {
        ...data.user,
        isEmailVerified: data.user.isVerified ?? data.user.isEmailVerified ?? false,
      };
      localStorage.setItem("user", JSON.stringify(user));
    }

    return data;
  },

  // ================= CHANGE PASSWORD =================
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return await apiRequest<{ success: boolean; message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // ================= FETCH PROFILE =================
  async fetchProfile(): Promise<UserProfile | null> {
    try {
      const data = await apiRequest<{ success: boolean; user: UserProfile }>("/auth/profile", {
        method: "GET",
      });
      if (data.user) {
        const user = {
          ...data.user,
          isEmailVerified: data.user.isVerified ?? data.user.isEmailVerified ?? false,
        };
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      }
      return null;
    } catch {
      return null;
    }
  },

  // ================= LOGOUT =================
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // ================= CURRENT USER =================
  getCurrentUser(): UserProfile | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      const u = JSON.parse(userStr);
      return {
        ...u,
        isEmailVerified: u.isVerified ?? u.isEmailVerified ?? false,
      };
    } catch {
      return null;
    }
  },

  // ================= DELETE ACCOUNT =================
  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    const data = await apiRequest<{ success: boolean; message: string }>("/auth/account", {
      method: "DELETE",
    });
    this.logout();
    return data;
  },

  // ================= AUTH STATUS =================
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
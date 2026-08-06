const API_BASE_URL = "http://localhost:5000/api";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  // Auto logout if JWT expired (only redirect on protected pages when a token was present)
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const publicPaths = ["/", "/login", "/register", "/pricing", "/verify-email", "/forgot-password"];
    const isPublicPage = publicPaths.includes(window.location.pathname);

    if (token && !isPublicPage) {
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
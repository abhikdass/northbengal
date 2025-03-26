// Authentication utility functions

import { authApi } from "./api";

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() < expiry;
  } catch (e) {
    console.error("Error parsing token:", e);
    return false;
  }
};

// Login user
export const login = async (
  email: string,
  password: string,
): Promise<boolean> => {
  try {
    const response = await authApi.login({ email, password });
    localStorage.setItem("authToken", response.token);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("userId", response.userId);
    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

// Register new user
export const register = async (userData: any): Promise<boolean> => {
  try {
    const response = await authApi.register(userData);
    localStorage.setItem("authToken", response.token);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("userId", response.userId);
    return true;
  } catch (error) {
    console.error("Registration failed:", error);
    return false;
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    await authApi.logout();
  } catch (error) {
    console.error("Logout API call failed:", error);
  } finally {
    // Always clear local storage even if API call fails
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  }
};

// Refresh token
export const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;

    const response = await authApi.refreshToken();
    localStorage.setItem("authToken", response.token);
    localStorage.setItem("refreshToken", response.refreshToken);
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear tokens if refresh fails
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    return false;
  }
};

// Setup auth refresh interval
export const setupAuthRefresh = (): number => {
  // Refresh token every 55 minutes (assuming 1 hour expiry)
  const refreshInterval = setInterval(
    async () => {
      if (isAuthenticated()) {
        const success = await refreshToken();
        if (!success) {
          // If refresh fails, clear interval
          clearInterval(refreshInterval);
        }
      } else {
        // If not authenticated, clear interval
        clearInterval(refreshInterval);
      }
    },
    55 * 60 * 1000,
  ); // 55 minutes

  return refreshInterval;
};

// Initialize auth on app start
export const initAuth = (): void => {
  if (isAuthenticated()) {
    setupAuthRefresh();
  } else {
    // Try to refresh token once on init if we have a refresh token
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      refreshToken().then((success) => {
        if (success) {
          setupAuthRefresh();
        }
      });
    }
  }
};

export default {
  isAuthenticated,
  login,
  register,
  logout,
  refreshToken,
  setupAuthRefresh,
  initAuth,
};

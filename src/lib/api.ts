// API utility functions for making requests to the backend

const API_BASE_URL = "https://api.northbengaltravel.com/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(errorData.message || "API request failed");
  }
  return response.json();
};

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// Generic fetch function with auth headers
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

// API functions for itineraries
export const itineraryApi = {
  getAll: () => fetchWithAuth("/itineraries"),
  getById: (id: string) => fetchWithAuth(`/itineraries/${id}`),
  create: (data: any) =>
    fetchWithAuth("/itineraries", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchWithAuth(`/itineraries/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchWithAuth(`/itineraries/${id}`, {
      method: "DELETE",
    }),
  share: (id: string, data: any) =>
    fetchWithAuth(`/itineraries/${id}/share`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPdf: (id: string) =>
    fetch(`${API_BASE_URL}/itineraries/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }),
};

// API functions for user profile
export const userApi = {
  getProfile: () => fetchWithAuth("/user/profile"),
  updateProfile: (data: any) =>
    fetchWithAuth("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  getSettings: () => fetchWithAuth("/user/settings"),
  updateSettings: (data: any) =>
    fetchWithAuth("/user/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// API functions for locations
export const locationApi = {
  getAll: () => fetchWithAuth("/locations"),
  getById: (id: string) => fetchWithAuth(`/locations/${id}`),
  search: (query: string) =>
    fetchWithAuth(`/locations/search?q=${encodeURIComponent(query)}`),
  getByType: (type: string) => fetchWithAuth(`/locations/type/${type}`),
};

// API functions for AI assistant
export const aiApi = {
  chat: (data: any) =>
    fetchWithAuth("/ai/chat", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// API functions for authentication
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData: any) =>
    fetchWithAuth("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  logout: () =>
    fetchWithAuth("/auth/logout", {
      method: "POST",
    }),
  refreshToken: () =>
    fetchWithAuth("/auth/refresh", {
      method: "POST",
    }),
};

// API functions for emergency services
export const emergencyApi = {
  getServices: () => fetchWithAuth("/emergency/services"),
  sendSOS: (data: { location: [number, number]; message: string }) =>
    fetchWithAuth("/emergency/sos", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAlerts: () => fetchWithAuth("/emergency/alerts"),
};

// Export all API functions
export default {
  itinerary: itineraryApi,
  user: userApi,
  location: locationApi,
  ai: aiApi,
  auth: authApi,
  emergency: emergencyApi,
};

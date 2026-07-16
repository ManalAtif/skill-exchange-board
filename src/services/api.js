import axios from "axios";

// Reads from .env / .env.local — never hardcode API URLs or secrets in source.
// See .env.example for the variable your team needs to set.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach the auth token to every request.
// SECURITY NOTE: storing the token in localStorage is convenient for an MVP,
// but it's readable by any script on the page (i.e. vulnerable to XSS). For
// production, prefer an httpOnly, Secure, SameSite=strict cookie set by the
// backend on login — the browser sends it automatically and JS can't read it.
// Ask your backend teammate whether auth is cookie-based; if so, this
// interceptor and localStorage calls in AuthContext can be deleted entirely.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the backend ever says the session is invalid/expired, clear local state
// so the UI doesn't keep pretending the person is logged in.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

// ---- Auth ----
export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout").catch(() => {}); // best-effort

// ---- Listings ----
export const getListings = (params) => api.get("/listings", { params });
export const getListingById = (id) => api.get(`/listings/${id}`);
export const createListing = (data) => api.post("/listings", data);
export const updateListing = (id, data) => api.put(`/listings/${id}`, data);
export const deleteListing = (id) => api.delete(`/listings/${id}`);

// ---- Matches ----
export const getMatches = () => api.get("/matches");

// ---- Messages ----
export const getMessages = (listingId) => api.get(`/messages/${listingId}`);
export const sendMessage = (data) => api.post("/messages", data);

// ---- Moderation ----
export const reportListing = (id, reason) => api.post(`/listings/${id}/report`, { reason });
export const blockUser = (userId) => api.post(`/users/${userId}/block`);

// ---- Profile ----
export const getProfile = () => api.get("/users/me");
export const updateProfile = (data) => api.put("/users/me", data);

export default api;

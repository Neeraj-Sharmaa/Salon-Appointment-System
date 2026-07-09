// API base URL configuration
// In production (Vercel), uses VITE_API_URL env variable
// In development, falls back to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_BASE_URL;

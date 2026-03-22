import axios from "axios";

/**
 * Centralised Axios instance.
 *
 * To change the backend URL, set VITE_API_URL in your .env file:
 *   VITE_API_URL=http://localhost:5000
 *
 * All components should import `api` from this file instead of
 * hardcoding axios.post("http://localhost:5000/...").
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor – attach auth token if needed in the future
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor – global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    }
    return Promise.reject(error);
  }
);

export default api;

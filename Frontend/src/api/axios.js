import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: false,
});

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor to catch any image-related errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404 && error.config.url.includes('/api/events')) {
      console.warn('API endpoint not responding:', error.config.url);
    }
    return Promise.reject(error);
  }
);

export default API;

import axios from "axios";

// Create axios instance with better configuration
const axiosInstance = axios.create({
  baseURL: "https://www.themealdb.com/api/json/v1/1",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging and error handling
axiosInstance.interceptors.request.use(
  (config) => {
    // Add timestamp for request tracking
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for consistent error handling and logging
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.DEV) {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`API call to ${response.config.url} took ${duration}ms`);
    }
    return response;
  },
  (error) => {
    // Centralized error handling
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.config.url);
    } else if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
import axiosInstance from "./axiosInstance";

// API Error class for better error handling
class ApiError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

// Cache for API responses to improve performance
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Generic API call with caching and error handling
 * @param {string} endpoint - API endpoint
 * @param {boolean} useCache - Whether to use cache
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise<any>} API response data
 */
const apiCall = async (endpoint, useCache = true, signal = null) => {
  const cacheKey = endpoint;

  // Check cache first
  if (useCache && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    cache.delete(cacheKey);
  }

  try {
    const config = signal ? { signal } : {};
    const response = await axiosInstance.get(endpoint, config);

    if (!response.data) {
      throw new ApiError('No data received', response.status, endpoint);
    }

    // Cache successful responses
    if (useCache && response.data) {
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }

    return response.data;
  } catch (error) {
    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      throw error; // Don't wrap cancellation errors
    }

    const status = error.response?.status || 0;
    const message = error.response?.data?.message || error.message || 'API request failed';
    throw new ApiError(message, status, endpoint);
  }
};

/**
 * Search meals by name with debouncing capability
 * @param {string} query - Search query
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise<Array>} Array of meals
 */
export const getMealsBySearch = async (query, signal = null) => {
  if (!query?.trim()) {
    return [];
  }

  try {
    const data = await apiCall(`/search.php?s=${encodeURIComponent(query)}`, false, signal);
    return data.meals || [];
  } catch (error) {
    if (error.name === 'CanceledError') throw error;
    console.error("Error searching meals:", error);
    return [];
  }
};

/**
 * Get meal details by ID
 * @param {string} id - Meal ID
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise<Object|null>} Meal object or null
 */
export const getMealById = async (id, signal = null) => {
  if (!id) {
    return null;
  }

  try {
    const data = await apiCall(`/lookup.php?i=${id}`, true, signal);
    return data.meals?.[0] || null;
  } catch (error) {
    if (error.name === 'CanceledError') throw error;
    console.error("Error fetching meal:", error);
    return null;
  }
};

/**
 * Get random meal
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise<Object|null>} Random meal object or null
 */
export const getRandomMeal = async (signal = null) => {
  try {
    const data = await apiCall(`/random.php`, false, signal);
    return data.meals?.[0] || null;
  } catch (error) {
    if (error.name === 'CanceledError') throw error;
    console.error("Error fetching random meal:", error);
    return null;
  }
};

/**
 * Get multiple random meals efficiently
 * @param {number} count - Number of random meals to fetch
 * @param {AbortSignal} signal - Abort signal for cancellation
 * @returns {Promise<Array>} Array of random meals
 */
export const getRandomMeals = async (count = 8, signal = null) => {
  try {
    const requests = Array.from({ length: count }, () =>
      getRandomMeal(signal)
    );

    const meals = await Promise.allSettled(requests);
    return meals
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);
  } catch (error) {
    console.error("Error fetching random meals:", error);
    return [];
  }
};

/**
 * Clear API cache
 */
export const clearCache = () => {
  cache.clear();
};

/**
 * Get cache size for debugging
 */
export const getCacheSize = () => cache.size;

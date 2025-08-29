import axiosInstance from "./axiosInstance";

// search meals by name
export const getMealsBySearch = async (query) => {
  try {
    const response = await axiosInstance.get(`/search.php?s=${query}`);
    return response.data.meals;
  } catch (error) {
    console.error("Error fetching meals:", error);
    return [];
  }
};

// get meal by ID
export const getMealById = async (id) => {
  try {
    const response = await axiosInstance.get(`/lookup.php?i=${id}`);
    return response.data.meals[0];
  } catch (error) {
    console.error("Error fetching meal:", error);
    return null;
  }
};

// get random meal
export const getRandomMeal = async () => {
  try {
    const response = await axiosInstance.get(`/random.php`);
    return response.data.meals[0];
  } catch (error) {
    console.error("Error fetching random meal:", error);
    return null;
  }
};

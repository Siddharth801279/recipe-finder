import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://www.themealdb.com/api/json/v1/1", // API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
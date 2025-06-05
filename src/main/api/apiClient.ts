import axios from "axios";
import { API_CONFIG } from "./config";

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: { "Content-Type": "application/json" }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(`API Error: ${error?.response?.data || error.message}`);
    return Promise.reject(error);
  }
);

export default apiClient;

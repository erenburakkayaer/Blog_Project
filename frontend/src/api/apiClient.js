import axios from "axios";

export const API_BASE_URL = "http://localhost:5080";
export const TOKEN_STORAGE_KEY = "technova_access_token";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

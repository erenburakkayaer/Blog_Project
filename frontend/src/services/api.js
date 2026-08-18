/**
 * TechNova — Centralized API Client Service
 * 
 * Bu dosya backend ve veritabanı yazan geliştirici arkadaşlarınız için
 * tek noktadan API isteklerini yönetmek üzere tasarlanmıştır.
 * 
 * Kullanım:
 * 1. .env dosyasına VITE_API_URL=http://localhost:5000/api yazın.
 * 2. Backend hazır olduğunda USE_MOCK_DATA değerini false yapın.
 */

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
export const USE_MOCK_DATA = true; // Backend hazır olduğunda false yapınız.

/**
 * Global HTTP request wrapper
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("technova_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Hatası: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[API Call Warning] ${endpoint}: ${error.message}`);
    throw error;
  }
}

export default {
  baseUrl: API_BASE_URL,
  useMock: USE_MOCK_DATA,
  apiRequest,
};

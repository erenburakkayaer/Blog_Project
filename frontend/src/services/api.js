/**
 * TechNova — Centralized API Client Service
 * 
 * 🔌 ASP.NET Core Web API (.NET 10 / SQL Server) Entegrasyonu
 * Backend Ekibi: BlogProject.API (Burak & Mehdide)
 * 
 * Özellikler:
 * - JWT Access Token (60 dk) + Refresh Token (7 gün rotasyonlu) desteği
 * - Otomatik 401 Interceptor: Token süresi dolduğunda /api/auth/refresh ile otomatik yenileme
 * - ASP.NET Core Validation / ProblemDetails hata formatlayıcı
 * - USE_MOCK_DATA bayrağı ile tek tuşla Mock ↔ Canlı API geçişi
 */

const API_BASE_URL = (import.meta.env?.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
export const USE_MOCK_DATA = true; // Canlı backend'e bağlanırken false yapınız.

/**
 * Token Yönetim Yardımcıları
 */
export const getToken = () => localStorage.getItem("accessToken") || localStorage.getItem("technova_token");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("technova_token", accessToken);
  }
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("technova_token");
  localStorage.removeItem("technova_user");
};

/**
 * Global HTTP Request Wrapper (.NET 10 Web API Uyumlu)
 */
export async function apiRequest(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  // Ensure endpoint starts with /api if not already prefixed and baseUrl doesn't contain /api
  const url = cleanEndpoint.startsWith("http") 
    ? cleanEndpoint 
    : `${API_BASE_URL}${cleanEndpoint.replace(/^\/api/, "")}`;

  const token = getToken();

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
    let response = await fetch(url, config);

    // 401 Unauthorized durumunda Refresh Token ile yenilemeyi dene
    if (response.status === 401 && getRefreshToken() && !endpoint.includes("/auth/")) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        // Yeni token ile isteği tekrarla
        config.headers.Authorization = `Bearer ${getToken()}`;
        response = await fetch(url, config);
      }
    }

    if (!response.ok) {
      let errorMessage = `API Hatası (${response.status})`;
      try {
        const errorData = await response.json();
        // ASP.NET Core Validation ProblemDetails formatı kontrolü
        if (errorData.errors && typeof errorData.errors === "object") {
          const firstKey = Object.keys(errorData.errors)[0];
          errorMessage = errorData.errors[firstKey][0] || errorData.title || errorMessage;
        } else if (errorData.message || errorData.title || errorData.detail) {
          errorMessage = errorData.message || errorData.title || errorData.detail;
        }
      } catch {
        // Yanıt JSON değilse varsayılan mesaj kalır
      }
      throw new Error(errorMessage);
    }

    // 204 No Content durumunda boş obje dön
    if (response.status === 204) return { success: true };

    return await response.json();
  } catch (error) {
    console.warn(`[.NET Web API Warning] ${cleanEndpoint}: ${error.message}`);
    throw error;
  }
}

/**
 * Refresh Token ile Access Token Yenileme (POST /api/auth/refresh)
 */
async function tryRefreshToken() {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (res.ok) {
      const data = await res.json();
      setTokens(data.accessToken || data.token, data.refreshToken);
      return true;
    }
  } catch {
    // Refresh başarısız
  }
  clearTokens();
  return false;
}

export default {
  baseUrl: API_BASE_URL,
  useMock: USE_MOCK_DATA,
  apiRequest,
  getToken,
  setTokens,
  clearTokens,
};

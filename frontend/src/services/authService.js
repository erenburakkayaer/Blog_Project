import apiClient, { TOKEN_STORAGE_KEY } from "../api/apiClient";

const REFRESH_STORAGE_KEY = "technova_refresh_token";

export const authService = {
  async login(credentials) {
    const response = await apiClient.post("/api/auth/login", {
      username: credentials.username?.trim() ?? credentials.email?.trim(),
      password: credentials.password,
    });

    const { accessToken, refreshToken } = response.data;

    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_STORAGE_KEY, refreshToken);
    }

    return response.data;
  },

  async logout() {
    const refreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);
    if (refreshToken) {
      await apiClient.post("/api/auth/logout", { refreshToken }).catch(() => {});
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_STORAGE_KEY);
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_STORAGE_KEY);
  },
};

/**
 * TechNova — Auth Service
 *
 * ✅ Şu an: Mock (sahte) verilerle çalışıyor.
 *    Test hesabı: admin@technova.com / Admin123!
 *
 * 🔌 Backend Bağlantısı İçin:
 *    1. USE_MOCK_DATA = false yapın (src/services/api.js)
 *    2. Aşağıdaki yorumlu API bölümlerini aktif edin.
 */

import { USE_MOCK_DATA, apiRequest } from "./api";

const FAKE_USERS = [
  {
    id: 1,
    firstName: "Samet",
    lastName: "Başkale",
    fullName: "Samet Başkale",
    email: "admin@technova.com",
    password: "Admin123!",
    roles: ["Admin"],
    role: "admin",
    balance: 1450.0,
  },
  {
    id: 2,
    firstName: "Zeynep",
    lastName: "Kaya",
    fullName: "Zeynep Kaya",
    email: "yazar@technova.com",
    password: "Yazar123!",
    roles: ["Editor"],
    role: "editor",
    balance: 620.0,
  },
];

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const createFakeToken = (user) => {
  const payload = { sub: user.id, email: user.email, roles: user.roles, issuedAt: Date.now() };
  return `technova-token.${btoa(JSON.stringify(payload))}.${Date.now()}`;
};

export const authService = {
  /**
   * Login
   * Backend: POST /api/auth/login → { token, user }
   */
  async login(credentials) {
    if (USE_MOCK_DATA) {
      await wait(800);
      const user = FAKE_USERS.find(
        (u) =>
          u.email.toLowerCase() === credentials.email.trim().toLowerCase() &&
          u.password === credentials.password
      );
      if (!user) throw new Error("E-posta adresi veya şifre hatalı.");
      return { token: createFakeToken(user), user };
    }

    // REAL API:
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    localStorage.setItem("technova_token", response.token);
    return response;
  },

  /**
   * Register
   * Backend: POST /api/auth/register → { token, user }
   */
  async register(userData) {
    if (USE_MOCK_DATA) {
      await wait(800);
      const newUser = {
        id: Date.now(),
        firstName: userData.fullName?.split(" ")[0] || "Kullanıcı",
        lastName: userData.fullName?.split(" ")[1] || "",
        fullName: userData.fullName || "Yeni Kullanıcı",
        email: userData.email,
        roles: [userData.role === "admin" ? "Admin" : "Editor"],
        role: userData.role || "editor",
        balance: 0,
      };
      return { token: createFakeToken(newUser), user: newUser };
    }

    // REAL API:
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    localStorage.setItem("technova_token", response.token);
    return response;
  },

  /**
   * Get Current User Profile
   * Backend: GET /api/auth/me
   */
  async getProfile() {
    if (USE_MOCK_DATA) {
      const tokenData = localStorage.getItem("technova_token");
      if (!tokenData) return null;
      return FAKE_USERS[0];
    }
    return await apiRequest("/auth/me");
  },

  /**
   * Logout
   */
  async logout() {
    await wait(150);
    localStorage.removeItem("technova_token");
  },

  /**
   * Forgot Password
   * Backend: POST /api/auth/forgot-password → { success }
   */
  async forgotPassword(email) {
    if (USE_MOCK_DATA) {
      await wait(700);
      return { success: true, message: `Sıfırlama bağlantısı ${email} adresine gönderildi.` };
    }
    return await apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

export default authService;

/**
 * TechNova — Auth Service
 * 
 * 🔌 ASP.NET Core (.NET 10 / SQL Server) Entegrasyonu
 * Backend: BlogProject.API (Burak & Mehdide)
 * 
 * Özellikler:
 * - POST /api/auth/login → { accessToken, refreshToken, user: { id, email, fullName, roles } }
 * - POST /api/auth/register → { accessToken, refreshToken, user }
 * - POST /api/auth/refresh → { accessToken, refreshToken }
 * - GET  /api/auth/me → Profil bilgileri
 * - Roller: SuperAdmin, Admin, Editor, Yazar
 */

import { USE_MOCK_DATA, apiRequest, setTokens, clearTokens } from "./api";

const FAKE_USERS = [
  {
    id: 1,
    userName: "admin",
    firstName: "Samet",
    lastName: "Başkale",
    fullName: "Samet Başkale (Yönetici)",
    email: "admin@technova.com",
    password: "Admin123!",
    roles: ["SuperAdmin", "Admin"],
    role: "admin",
    balance: 1450.0,
  },
  {
    id: 2,
    userName: "yazar",
    firstName: "Zeynep",
    lastName: "Kaya",
    fullName: "Zeynep Kaya",
    email: "yazar@technova.com",
    password: "Yazar123!",
    roles: ["Yazar", "Editor"],
    role: "editor",
    balance: 620.0,
  },
];

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const createFakeToken = (user) => {
  const payload = { sub: user.id, email: user.email, roles: user.roles, issuedAt: Date.now() };
  return `technova-access-token.${btoa(JSON.stringify(payload))}.${Date.now()}`;
};

export const authService = {
  /**
   * Login (Giriş)
   * ASP.NET Core: POST /api/auth/login
   * Body: { email/userName, password }
   * Response: { accessToken, refreshToken, user }
   */
  async login(credentials) {
    const identifier = (credentials.email || credentials.userName || "").trim().toLowerCase();

    if (USE_MOCK_DATA) {
      await wait(600);
      const user = FAKE_USERS.find(
        (u) =>
          (u.email.toLowerCase() === identifier || u.userName.toLowerCase() === identifier) &&
          u.password === credentials.password
      );
      if (!user) throw new Error("E-posta/Kullanıcı adı veya şifre hatalı.");

      const accessToken = createFakeToken(user);
      const refreshToken = `mock-refresh-token-${Date.now()}`;
      setTokens(accessToken, refreshToken);
      localStorage.setItem("technova_user", JSON.stringify(user));

      return { token: accessToken, accessToken, refreshToken, user };
    }

    // REAL .NET WEB API CALL
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email || credentials.userName,
        userName: credentials.userName || credentials.email,
        password: credentials.password,
      }),
    });

    const token = response.accessToken || response.token;
    const refreshToken = response.refreshToken;
    setTokens(token, refreshToken);

    if (response.user) {
      localStorage.setItem("technova_user", JSON.stringify(response.user));
    }

    return { ...response, token };
  },

  /**
   * Register (Kayıt Ol)
   * ASP.NET Core: POST /api/auth/register
   */
  async register(userData) {
    if (USE_MOCK_DATA) {
      await wait(600);
      const newUser = {
        id: Date.now(),
        userName: userData.email?.split("@")[0] || "kullanici",
        firstName: userData.fullName?.split(" ")[0] || "Kullanıcı",
        lastName: userData.fullName?.split(" ").slice(1).join(" ") || "",
        fullName: userData.fullName || "Yeni Kullanıcı",
        email: userData.email,
        roles: [userData.role === "admin" ? "Admin" : "Yazar"],
        role: userData.role === "admin" ? "admin" : "editor",
        balance: 0,
      };
      const accessToken = createFakeToken(newUser);
      const refreshToken = `mock-refresh-token-${Date.now()}`;
      setTokens(accessToken, refreshToken);
      localStorage.setItem("technova_user", JSON.stringify(newUser));

      return { token: accessToken, accessToken, refreshToken, user: newUser };
    }

    // REAL .NET WEB API CALL
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    const token = response.accessToken || response.token;
    setTokens(token, response.refreshToken);
    return { ...response, token };
  },

  /**
   * Get Current User Profile
   * ASP.NET Core: GET /api/auth/me
   */
  async getProfile() {
    if (USE_MOCK_DATA) {
      const stored = localStorage.getItem("technova_user");
      if (stored) return JSON.parse(stored);
      return FAKE_USERS[0];
    }
    return await apiRequest("/auth/me");
  },

  /**
   * Logout (Çıkış)
   */
  async logout() {
    await wait(100);
    clearTokens();
  },

  /**
   * Forgot Password
   * ASP.NET Core: POST /api/auth/forgot-password
   */
  async forgotPassword(email) {
    if (USE_MOCK_DATA) {
      await wait(500);
      return { success: true, message: `Sıfırlama bağlantısı ${email} adresine iletildi.` };
    }
    return await apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

export default authService;

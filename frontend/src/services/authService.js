/**
 * TechNova — Centralized Auth Service
 * 
 * 🔌 ASP.NET Core (.NET 8 / .NET 10 / SQL Server) Entegrasyonu & Akıllı Fallback
 * Backend: BlogProject.API (Burak & Mehdide)
 */

import { USE_MOCK_DATA, apiRequest, setTokens, clearTokens } from "./api";

const FAKE_USERS = [
  {
    id: 1,
    userName: "admin",
    firstName: "Samet",
    lastName: "Başkale",
    fullName: "Samet Başkale",
    email: "admin@technova.com",
    password: "Admin123!",
    roles: ["SuperAdmin", "Admin"],
    role: "admin",
    balance: 1450.0,
  },
  {
    id: 2,
    userName: "merve_ik",
    firstName: "Merve",
    lastName: "Aydın",
    fullName: "Merve Aydın (İK)",
    email: "ik@technova.com",
    password: "Ik123!",
    roles: ["HR"],
    role: "hr",
    balance: 0,
  },
  {
    id: 3,
    userName: "zeynep_yazar",
    firstName: "Zeynep",
    lastName: "Kaya",
    fullName: "Zeynep Kaya",
    email: "yazar@technova.com",
    password: "Yazar123!",
    roles: ["Yazar"],
    role: "author",
    balance: 620.0,
  },
  {
    id: 4,
    userName: "eren_dev",
    firstName: "Eren",
    lastName: "Demir",
    fullName: "Eren Demir",
    email: "dev@technova.com",
    password: "Dev123!",
    roles: ["Editor"],
    role: "editor",
    balance: 350.0,
  },
  {
    id: 5,
    userName: "burak_ogrenci",
    firstName: "Burak",
    lastName: "Çelik",
    fullName: "Burak Çelik",
    email: "ogrenci@technova.com",
    password: "User123!",
    roles: ["User"],
    role: "user",
    balance: 0,
  },
];

const getStoredRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem("technova_registered_users");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRegisteredUser = (user) => {
  try {
    const list = getStoredRegisteredUsers();
    const filtered = list.filter((u) => u.email?.toLowerCase() !== user.email?.toLowerCase());
    localStorage.setItem("technova_registered_users", JSON.stringify([...filtered, user]));
  } catch (e) {
    console.error("User save error", e);
  }
};

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const createFakeToken = (user) => {
  const payload = { sub: user.id, email: user.email, roles: user.roles || [user.role], issuedAt: Date.now() };
  return `technova-access-token.${btoa(JSON.stringify(payload))}.${Date.now()}`;
};

export const authService = {
  /**
   * Login (Giriş)
   * ASP.NET Core: POST /api/auth/login
   */
  async login(credentials) {
    const identifier = (credentials.email || credentials.userName || credentials.username || "").trim().toLowerCase();

    // 1. Önce kayıtlı yerel kullanıcıları ve mock kullanıcıları kontrol et
    const registeredUsers = getStoredRegisteredUsers();
    const allUsers = [...registeredUsers, ...FAKE_USERS];
    const localMatchedUser = allUsers.find(
      (u) =>
        (u.email?.toLowerCase() === identifier || u.userName?.toLowerCase() === identifier) &&
        u.password === credentials.password
    );

    // Eğer USE_MOCK_DATA aktifse veya yerel kullanıcı varsa direkt oturum aç
    if (USE_MOCK_DATA || localMatchedUser) {
      await wait(300);
      if (localMatchedUser) {
        const accessToken = createFakeToken(localMatchedUser);
        const refreshToken = `mock-refresh-token-${Date.now()}`;
        setTokens(accessToken, refreshToken);
        localStorage.setItem("technova_user", JSON.stringify(localMatchedUser));
        return { token: accessToken, accessToken, refreshToken, user: localMatchedUser };
      }
      if (USE_MOCK_DATA) {
        throw new Error("E-posta/Kullanıcı adı veya şifre hatalı.");
      }
    }

    // 2. Gerçek .NET Web API Login Çağrısı
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: identifier,
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
    } catch (apiError) {
      // Backend bağlantısı veya kullanıcı bulunamadığında yerel kontrol yapılmıştı
      throw new Error(apiError.message || "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
    }
  },

  /**
   * Register (Kayıt Ol)
   * Hem frontend state'ini hem de yerel depolamayı anında günceller
   */
  async register(userData) {
    await wait(300);
    const roleKey = userData.role || "author";
    const newUser = {
      id: Date.now(),
      userName: userData.email?.split("@")[0] || "kullanici",
      firstName: userData.fullName?.split(" ")[0] || "Kullanıcı",
      lastName: userData.fullName?.split(" ").slice(1).join(" ") || "",
      fullName: userData.fullName || "Yeni Kullanıcı",
      email: userData.email,
      password: userData.password,
      roles: [roleKey === "admin" ? "Admin" : roleKey === "hr" ? "HR" : roleKey === "editor" ? "Editor" : "Yazar"],
      role: roleKey,
      balance: 0,
      createdAt: new Date().toISOString(),
    };

    // Kullanıcıyı yerel listeye kaydet
    saveRegisteredUser(newUser);

    const accessToken = createFakeToken(newUser);
    const refreshToken = `mock-refresh-token-${Date.now()}`;
    setTokens(accessToken, refreshToken);
    localStorage.setItem("technova_user", JSON.stringify(newUser));

    return { token: accessToken, accessToken, refreshToken, user: newUser };
  },

  /**
   * Get Current User Profile
   */
  async getProfile() {
    const stored = localStorage.getItem("technova_user");
    if (stored) return JSON.parse(stored);
    return FAKE_USERS[0];
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
   */
  async forgotPassword(email) {
    await wait(400);
    return { success: true, message: `Sıfırlama bağlantısı ${email} adresine iletildi.` };
  },
};

export default authService;

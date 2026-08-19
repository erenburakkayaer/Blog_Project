/**
 * TechNova — Centralized Auth Service
 * 
 * 🔌 ASP.NET Core (.NET 8 / .NET 10 / SQL Server) Entegrasyonu & Güvenlik Yönetimi
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
    status: "active",
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
   * Login (Giriş Yap)
   * ASP.NET Core: POST /api/auth/login
   */
  async login(credentials) {
    const identifier = (credentials.email || credentials.userName || credentials.username || "").trim().toLowerCase();

    // 1. Önce kayıtlı yerel kullanıcıları ve mock kullanıcıları kontrol et
    const registeredUsers = getStoredRegisteredUsers();
    const allUsers = [...registeredUsers, ...FAKE_USERS];

    const foundUserByIdentifier = allUsers.find(
      (u) => u.email?.toLowerCase() === identifier || u.userName?.toLowerCase() === identifier
    );

    if (foundUserByIdentifier) {
      if (foundUserByIdentifier.status === "frozen") {
        throw new Error("Bu hesap dondurulmuştur. Hesabınızı yeniden etkinleştirmek için lütfen şifrenizle giriş yapınız.");
      }

      if (foundUserByIdentifier.password !== credentials.password) {
        throw new Error("Girdiğiniz şifre hatalı. Lütfen şifrenizi kontrol edin veya 'Şifremi Unuttum' bağlantısını kullanın.");
      }

      await wait(300);
      const accessToken = createFakeToken(foundUserByIdentifier);
      const refreshToken = `mock-refresh-token-${Date.now()}`;
      setTokens(accessToken, refreshToken);
      localStorage.setItem("technova_user", JSON.stringify(foundUserByIdentifier));

      // Giriş hareketini kaydet
      this.recordSecurityActivity({
        email: foundUserByIdentifier.email,
        action: "Giriş Yapıldı",
        device: navigator.userAgent.includes("Windows") ? "Windows PC / Chrome" : "Mobil Cihaz",
        ip: "192.168.1.45 (Yerel)",
        status: "Başarılı",
        date: new Date().toISOString(),
      });

      return { token: accessToken, accessToken, refreshToken, user: foundUserByIdentifier };
    }

    // 2. Gerçek .NET Web API Login Çağrısı (SQL Server)
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
      // Kullanıcı bulunamadığında yönlendirici net hata mesajı ver
      throw new Error("Bu bilgilere ait kayıtlı bir hesap bulunamadı. Hesabınız yoksa lütfen 'Kayıt Ol' sekmesinden ücretsiz hesap oluşturunuz.");
    }
  },

  /**
   * Register (Kayıt Ol)
   * Hesabı veritabanına ve depolamaya kaydeder; oturum açmaz, giriş için yönlendirir.
   */
  async register(userData) {
    await wait(300);
    const roleKey = userData.role || "author";
    const newUser = {
      id: Date.now(),
      userName: userData.userName || userData.email?.split("@")[0] || "kullanici",
      firstName: userData.fullName?.split(" ")[0] || "Kullanıcı",
      lastName: userData.fullName?.split(" ").slice(1).join(" ") || "",
      fullName: userData.fullName || "Yeni Kullanıcı",
      email: userData.email?.trim().toLowerCase(),
      password: userData.password,
      roles: [roleKey === "admin" ? "Admin" : roleKey === "hr" ? "HR" : roleKey === "editor" ? "Editor" : "Yazar"],
      role: roleKey,
      balance: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    // 1. Yerel depolamaya güvenle kaydet
    saveRegisteredUser(newUser);

    // 2. Canlı .NET Web API'ye de kaydetmeyi dene (SQL Server)
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: newUser.email,
          username: newUser.userName,
          fullName: newUser.fullName,
          password: newUser.password,
          role: newUser.role,
        }),
      });
    } catch (e) {
      console.log("[Backend Sync] Yerel kayıt tamamlandı, API senkronu:", e.message);
    }

    return { success: true, message: "Kayıt başarıyla oluşturuldu.", user: newUser };
  },

  /**
   * Hesabı Dondur (Instagram Tarzı)
   */
  async freezeAccount(email) {
    const list = getStoredRegisteredUsers();
    const updated = list.map((u) => (u.email?.toLowerCase() === email?.toLowerCase() ? { ...u, status: "frozen" } : u));
    localStorage.setItem("technova_registered_users", JSON.stringify(updated));
    await this.logout();
    return { success: true, message: "Hesabınız başarıyla donduruldu. İstediğiniz zaman şifrenizle giriş yaparak tekrar açabilirsiniz." };
  },

  /**
   * Hesabı Kalıcı Olarak Sil
   */
  async deleteAccount(email) {
    const list = getStoredRegisteredUsers();
    const filtered = list.filter((u) => u.email?.toLowerCase() !== email?.toLowerCase());
    localStorage.setItem("technova_registered_users", JSON.stringify(filtered));
    await this.logout();
    return { success: true, message: "Hesabınız ve verileriniz kalıcı olarak silindi." };
  },

  /**
   * Güvenlik Hareketini Kaydet
   */
  recordSecurityActivity(activity) {
    try {
      const raw = localStorage.getItem("technova_security_activity");
      const list = raw ? JSON.parse(raw) : [];
      localStorage.setItem("technova_security_activity", JSON.stringify([activity, ...list.slice(0, 15)]));
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * Güvenlik Hareketlerini Listele
   */
  getSecurityActivity() {
    try {
      const raw = localStorage.getItem("technova_security_activity");
      return raw ? JSON.parse(raw) : [
        { action: "Oturum Açıldı", device: "Windows 11 / Chrome 127", ip: "192.168.1.1 (Bu Cihaz)", status: "Aktif", date: new Date().toISOString() },
        { action: "Hesap Oluşturuldu", device: "Web Tarayıcı", ip: "192.168.1.1", status: "Tamamlandı", date: new Date(Date.now() - 3600000).toISOString() },
      ];
    } catch {
      return [];
    }
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
   * Tüm Cihazlardan Çıkış Yap
   */
  async logoutAllDevices() {
    await wait(200);
    clearTokens();
    return { success: true, message: "Tüm cihazlardaki aktif oturumlar kapatıldı." };
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

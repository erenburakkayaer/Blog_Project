import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import AuthContext from "./authContext";
import { authService } from "../services/authService";

const AUTH_STORAGE_KEY = "technova_auth_user";

const getStoredUser = () => {
  try {
    const storedUser =
      localStorage.getItem(AUTH_STORAGE_KEY) ||
      localStorage.getItem("technova_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

// Backend rollerini frontend slug'larına çevirir
const mapRole = (user) => {
  if (!user) return "user";
  const r = (user.role || user.roles?.[0] || "").toLowerCase();
  if (r === "superadmin" || r === "admin") return "admin";
  if (r === "hr" || r === "insan kaynakları" || r === "humanresources") return "hr";
  if (r === "yazar" || r === "author") return "author";
  if (r === "editor" || r === "geliştirici") return "editor";
  return "user";
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);

      if (response && response.user) {
        const authUser = {
          ...response.user,
          role: mapRole(response.user),
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        localStorage.setItem("technova_user", JSON.stringify(authUser));
        setUser(authUser);
        return { success: true, user: authUser };
      }

      throw new Error("Giriş başarısız. Kullanıcı bilgileri alınamadı.");
    } catch (err) {
      const message = err.message || "Giriş yapılamadı.";
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Kayıt işlemi: ASLA otomatik oturum açmaz. Sadece kaydı tamamlar.
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      return { success: true, message: response?.message || "Kayıt başarıyla oluşturuldu." };
    } catch (err) {
      const message = err.message || "Kayıt işlemi gerçekleştirilemedi.";
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch { /* ignore */ }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("technova_user");
    localStorage.removeItem("technova_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }, []);

  const freezeAccount = useCallback(async () => {
    if (!user?.email) return;
    const res = await authService.freezeAccount(user.email);
    setUser(null);
    return res;
  }, [user]);

  const deleteAccount = useCallback(async () => {
    if (!user?.email) return;
    const res = await authService.deleteAccount(user.email);
    setUser(null);
    return res;
  }, [user]);

  const logoutAllDevices = useCallback(async () => {
    const res = await authService.logoutAllDevices();
    setUser(null);
    return res;
  }, []);

  const hasRole = useCallback(
    (allowedRoles) => {
      if (!user) return false;
      if (!allowedRoles || allowedRoles.length === 0) return true;

      const userRoles = [
        user.role?.toLowerCase(),
        ...(Array.isArray(user.roles) ? user.roles.map((r) => r.toLowerCase()) : []),
      ].filter(Boolean);

      const targetRoles = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).map(
        (r) => r.toLowerCase()
      );

      // Admin ve SuperAdmin her zaman tam erişime sahiptir
      if (userRoles.includes("admin") || userRoles.includes("superadmin")) return true;

      return targetRoles.some((target) => userRoles.includes(target));
    },
    [user]
  );

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      freezeAccount,
      deleteAccount,
      logoutAllDevices,
      hasRole,
    }),
    [user, isLoading, login, register, logout, freezeAccount, deleteAccount, logoutAllDevices, hasRole]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;

import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import AuthContext from "./authContext";
import { authService } from "../services/authService";

const AUTH_STORAGE_KEY = "technova_auth_user";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem("technova_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = useCallback(async ({ email, password, userName }) => {
    try {
      const response = await authService.login({ email, password, userName });
      if (response && response.user) {
        const authUser = {
          ...response.user,
          role: response.user.role || (response.user.roles?.[0]?.toLowerCase() === "superadmin" || response.user.roles?.[0]?.toLowerCase() === "admin" ? "admin" : "editor"),
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        localStorage.setItem("technova_user", JSON.stringify(authUser));
        setUser(authUser);
        return { success: true, user: authUser };
      }
      return { success: false, message: "Giriş başarısız." };
    } catch (err) {
      return { success: false, message: err.message || "Giriş yapılamadı." };
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("technova_user");
    localStorage.removeItem("technova_token");
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (allowedRoles) => {
      if (!user) return false;
      if (!allowedRoles || allowedRoles.length === 0) return true;

      const userRoles = [
        user.role?.toLowerCase(),
        ...(Array.isArray(user.roles) ? user.roles.map((r) => r.toLowerCase()) : []),
      ].filter(Boolean);

      const targetRoles = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).map((r) =>
        r.toLowerCase()
      );

      // SuperAdmin veya Admin her zaman tam erişime sahiptir
      if (userRoles.includes("admin") || userRoles.includes("superadmin")) return true;

      return targetRoles.some((target) => userRoles.includes(target));
    },
    [user]
  );

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      hasRole,
    }),
    [user, login, logout, hasRole]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;

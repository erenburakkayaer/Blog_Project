import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";

import AuthContext from "./authContext";

const AUTH_STORAGE_KEY = "technova_auth_user";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = useCallback(({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== "admin@technova.com" || password !== "Admin123!") {
      return {
        success: false,
        message: "E-posta adresi veya şifre hatalı.",
      };
    }

    const authenticatedUser = {
      id: 1,
      name: "Admin Kullanıcı",
      email: normalizedEmail,
      role: "admin",
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));

    setUser(authenticatedUser);

    return {
      success: true,
      user: authenticatedUser,
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (allowedRoles) => {
      if (!user) {
        return false;
      }

      if (!allowedRoles) {
        return true;
      }

      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      return roles.includes(user.role);
    },
    [user],
  );

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      hasRole,
    }),
    [user, login, logout, hasRole],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;

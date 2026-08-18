import { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";

import apiClient, { TOKEN_STORAGE_KEY } from "../api/apiClient";
import AuthContext from "./authContext";

const AUTH_STORAGE_KEY = "technova_auth_user";
const REFRESH_STORAGE_KEY = "technova_refresh_token";

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
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async ({ username, password }) => {
    setIsLoading(true);

    try {
      const response = await apiClient.post("/api/auth/login", {
        username: username.trim(),
        password,
      });

      const { accessToken, refreshToken, user: authenticatedUser } = response.data;

      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      localStorage.setItem(REFRESH_STORAGE_KEY, refreshToken);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));

      setUser(authenticatedUser);

      return { success: true, user: authenticatedUser };
    } catch (error) {
      const message =
        error.response?.data?.message || "Kullanıcı adı veya parola hatalı.";
      throw new Error(message, { cause: error });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);

    if (refreshToken) {
      apiClient.post("/api/auth/logout", { refreshToken }).catch(() => {});
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_STORAGE_KEY);
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
      isLoading,
      login,
      logout,
      hasRole,
    }),
    [user, isLoading, login, logout, hasRole],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;

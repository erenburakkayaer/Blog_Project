import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService";
import { storage } from "../utils/storage";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [token, setToken] = useState(() => storage.getToken());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    setIsLoading(true);

    try {
      const authData = await authService.login({
        email,
        password,
      });

      storage.setAuth({
        token: authData.token,
        user: authData.user,
        rememberMe,
      });

      setToken(authData.token);
      setUser(authData.user);

      return authData.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await authService.logout();
    } finally {
      storage.clearAuth();
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const hasRole = useCallback(
    (requiredRoles) => {
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      if (!user?.roles) {
        return false;
      }

      return requiredRoles.some((role) => user.roles.includes(role));
    },
    [user],
  );

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
      hasRole,
    }),
    [user, token, isLoading, login, logout, hasRole],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth, AuthProvider içerisinde kullanılmalıdır.");
  }

  return context;
}

export { AuthProvider, useAuth };

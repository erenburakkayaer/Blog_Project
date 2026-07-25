const STORAGE_KEYS = {
  ACCESS_TOKEN: "technova_access_token",
  USER: "technova_user",
};

const getStorage = (rememberMe = true) =>
  rememberMe ? localStorage : sessionStorage;

export const storage = {
  setAuth({ token, user, rememberMe = true }) {
    this.clearAuth();

    const selectedStorage = getStorage(rememberMe);

    selectedStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    selectedStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getToken() {
    return (
      localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    );
  },

  getUser() {
    const rawUser =
      localStorage.getItem(STORAGE_KEYS.USER) ||
      sessionStorage.getItem(STORAGE_KEYS.USER);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser);
    } catch {
      this.clearAuth();
      return null;
    }
  },

  clearAuth() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  },
};

export { STORAGE_KEYS };

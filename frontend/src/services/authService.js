const FAKE_ADMIN = {
  id: 1,
  firstName: "Admin",
  lastName: "TechNova",
  fullName: "Admin TechNova",
  email: "admin@technova.com",
  roles: ["Admin"],
};

const FAKE_CREDENTIALS = {
  email: "admin@technova.com",
  password: "Admin123!",
};

const wait = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const createFakeToken = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    roles: user.roles,
    issuedAt: Date.now(),
  };

  return `fake-token.${btoa(JSON.stringify(payload))}.${Date.now()}`;
};

export const authService = {
  async login(credentials) {
    await wait(900);

    const normalizedEmail = credentials.email.trim().toLowerCase();

    const credentialsAreValid =
      normalizedEmail === FAKE_CREDENTIALS.email &&
      credentials.password === FAKE_CREDENTIALS.password;

    if (!credentialsAreValid) {
      throw new Error("E-posta adresi veya şifre hatalı.");
    }

    return {
      token: createFakeToken(FAKE_ADMIN),
      user: FAKE_ADMIN,
    };
  },

  async logout() {
    await wait(250);
  },
};

/*
  BACKEND ENTEGRASYONU:

  Arkadaşın daha sonra yalnızca login fonksiyonunu gerçek API çağrısıyla
  değiştirebilir.

  Örnek:

  import apiClient from "../api/apiClient";

  async login(credentials) {
    const response = await apiClient.post("/api/auth/login", credentials);

    return {
      token: response.data.accessToken,
      user: response.data.user,
    };
  }
*/

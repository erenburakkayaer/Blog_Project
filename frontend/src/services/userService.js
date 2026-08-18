// src/services/userService.js
// Kullanıcı & Rol Yönetimi API Servisi (Mehdi DTO & Role modelleriyle %100 uyumlu)

import { getStoredData, setStoredData } from "../utils/storage";

export const USER_ROLES = [
  { key: "admin", label: "Şirket Yöneticisi (Admin)", color: "danger", badge: "👑 Yönetici" },
  { key: "hr", label: "İnsan Kaynakları (İK)", color: "warning", badge: "👥 İK Müdürü" },
  { key: "editor", label: "Editör & Geliştirici", color: "info", badge: "💻 Editör" },
  { key: "author", label: "Yazar / İçerik Üreticisi", color: "primary", badge: "✍️ Yazar" },
  { key: "user", label: "Normal Kullanıcı / Öğrenci", color: "secondary", badge: "👤 Kullanıcı" },
];

const INITIAL_USERS = [
  {
    id: "1",
    name: "Samet Başkale",
    fullName: "Samet Başkale",
    userName: "samet_admin",
    email: "admin@technova.com",
    role: "admin",
    roles: ["SuperAdmin", "Admin"],
    jobTitle: "Şirket Yöneticisi & Kurucu",
    status: "active",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "2",
    name: "Merve İK Uzmanı",
    fullName: "Merve Aydın",
    userName: "merve_ik",
    email: "ik@technova.com",
    role: "hr",
    roles: ["HR"],
    jobTitle: "İnsan Kaynakları Direktörü",
    status: "active",
    createdAt: "2026-02-10T11:00:00.000Z",
  },
  {
    id: "3",
    name: "Zeynep Kaya",
    fullName: "Zeynep Kaya",
    userName: "zeynep_yazar",
    email: "yazar@technova.com",
    role: "author",
    roles: ["Yazar"],
    jobTitle: "Kıdemli İçerik Üreticisi",
    status: "active",
    createdAt: "2026-03-20T14:30:00.000Z",
  },
  {
    id: "4",
    name: "Eren Editör",
    fullName: "Eren Demir",
    userName: "eren_dev",
    email: "dev@technova.com",
    role: "editor",
    roles: ["Editor"],
    jobTitle: "Senior Frontend Developer",
    status: "active",
    createdAt: "2026-04-12T09:15:00.000Z",
  },
  {
    id: "5",
    name: "Burak Öğrenci",
    fullName: "Burak Çelik",
    userName: "burak_user",
    email: "ogrenci@technova.com",
    role: "user",
    roles: ["User"],
    jobTitle: "Yazılım Stajyeri / Öğrenci",
    status: "active",
    createdAt: "2026-05-01T08:00:00.000Z",
  },
];

export const userService = {
  getAll: async () => {
    const users = getStoredData("technova_users", INITIAL_USERS);
    return { data: users };
  },

  getById: async (id) => {
    const users = getStoredData("technova_users", INITIAL_USERS);
    const user = users.find((u) => String(u.id) === String(id));
    if (!user) throw new Error("Kullanıcı bulunamadı.");
    return { data: user };
  },

  create: async (userData) => {
    let users = getStoredData("technova_users", INITIAL_USERS);
    const newUser = {
      id: Date.now().toString(),
      name: userData.name || userData.fullName,
      fullName: userData.fullName || userData.name,
      userName: userData.userName || userData.email?.split("@")[0] || "user",
      email: userData.email,
      role: userData.role || "author",
      roles: [userData.role === "admin" ? "Admin" : userData.role === "hr" ? "HR" : "Yazar"],
      jobTitle: userData.jobTitle || "TechNova Üyesi",
      status: userData.status || "active",
      createdAt: new Date().toISOString(),
    };
    users = [newUser, ...users];
    setStoredData("technova_users", users);
    return { data: newUser };
  },

  update: async (id, userData) => {
    let users = getStoredData("technova_users", INITIAL_USERS);
    let updatedUser = null;
    users = users.map((u) => {
      if (String(u.id) === String(id)) {
        updatedUser = {
          ...u,
          ...userData,
          fullName: userData.name || userData.fullName || u.fullName,
          roles: [userData.role === "admin" ? "Admin" : userData.role === "hr" ? "HR" : "Yazar"],
        };
        return updatedUser;
      }
      return u;
    });
    setStoredData("technova_users", users);
    return { data: updatedUser };
  },

  delete: async (id) => {
    let users = getStoredData("technova_users", INITIAL_USERS);
    users = users.filter((u) => String(u.id) !== String(id));
    setStoredData("technova_users", users);
    return { success: true };
  },
};

export default userService;

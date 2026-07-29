// src/services/userService.js
// Kullanıcı Yönetimi için API Servisi

import { getStoredData, setStoredData } from "../utils/storage";

const INITIAL_USERS = [
  {
    id: "1",
    name: "Samet Yönetici",
    email: "samet@technova.com",
    role: "admin",
    status: "active",
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "2",
    name: "Eren Editör",
    email: "eren@technova.com",
    role: "editor",
    status: "active",
    createdAt: "2026-03-20T14:30:00.000Z",
  },
  {
    id: "3",
    name: "Zeynep Yazar",
    email: "zeynep@technova.com",
    role: "author",
    status: "passive",
    createdAt: "2026-05-10T09:15:00.000Z",
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
      ...userData,
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

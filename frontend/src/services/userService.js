// src/services/userService.js
// Kullanıcı Yönetimi için API Servisi

import apiClient from "../api/apiClient";

export const userService = {
  getAll: async () => {
    const response = await apiClient.get("/api/users", {
      params: { page: 1, pageSize: 100 },
    });
    return { data: response.data.items };
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/users/${id}`);
    return { data: response.data };
  },

  create: async (userData) => {
    const response = await apiClient.post("/api/users", {
      name: userData.name.trim(),
      email: userData.email.trim(),
      role: userData.role,
    });
    return { data: response.data };
  },

  update: async (id, userData) => {
    await apiClient.put(`/api/users/${id}`, {
      name: userData.name.trim(),
      email: userData.email.trim(),
      role: userData.role,
      status: userData.status,
    });
    return { success: true };
  },

  delete: async (id) => {
    await apiClient.delete(`/api/users/${id}`);
    return { success: true };
  },
};

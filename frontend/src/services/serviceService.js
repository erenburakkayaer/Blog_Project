// src/services/serviceService.js
// Hizmet Yönetimi için API Servisi

import apiClient from "../api/apiClient";

const createSlug = (title) =>
  title
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const serviceService = {
  // Tüm hizmetleri getir
  getAll: async () => {
    const response = await apiClient.get("/api/services", {
      params: { page: 1, pageSize: 100 },
    });
    return { data: response.data.items };
  },

  // ID'ye göre hizmet getir
  getById: async (id) => {
    const response = await apiClient.get(`/api/services/${id}`);
    return { data: response.data };
  },

  // Yeni hizmet oluştur
  create: async (serviceData) => {
    const response = await apiClient.post("/api/services", {
      title: serviceData.title.trim(),
      slug: createSlug(serviceData.title),
      description: serviceData.description?.trim() || "",
      icon: serviceData.icon || "bi-gear",
      status: serviceData.status || "active",
    });
    return { data: response.data };
  },

  // Hizmeti güncelle
  update: async (id, serviceData) => {
    const response = await apiClient.put(`/api/services/${id}`, {
      title: serviceData.title.trim(),
      slug: createSlug(serviceData.title),
      description: serviceData.description?.trim() || "",
      icon: serviceData.icon || "bi-gear",
      status: serviceData.status || "active",
    });
    return { data: response.data };
  },

  // Hizmeti sil
  delete: async (id) => {
    await apiClient.delete(`/api/services/${id}`);
    return { success: true };
  },
};

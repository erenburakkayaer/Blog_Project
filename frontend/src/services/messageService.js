// src/services/messageService.js
// İletişim Mesajları Yönetimi için API Servisi

import apiClient from "../api/apiClient";

export const messageService = {
  // Tüm mesajları getir
  getAll: async () => {
    const response = await apiClient.get("/api/messages", {
      params: { page: 1, pageSize: 100 },
    });
    return { data: response.data.items };
  },

  // ID'ye göre tekil mesaj detayı getir
  getById: async (id) => {
    const response = await apiClient.get(`/api/messages/${id}`);
    return { data: response.data };
  },

  // Mesajın okundu/okunmadı durumunu güncelle
  updateStatus: async (id, statusData) => {
    await apiClient.put(`/api/messages/${id}`, statusData);
    return { success: true };
  },

  // Önemli işaretini değiştir (yeni değer çağıran taraftan gelir)
  toggleImportant: async (id, nextValue) => {
    await apiClient.put(`/api/messages/${id}`, { isImportant: nextValue });
    return { success: true };
  },

  // Mesaja yanıt gönder (yalnızca kayıt altına alınır, e-posta gönderimi yok)
  reply: async (id, replyMessage) => {
    const response = await apiClient.post(`/api/messages/${id}/reply`, {
      replyMessage,
    });
    return { data: response.data };
  },

  // Mesajı sil
  delete: async (id) => {
    await apiClient.delete(`/api/messages/${id}`);
    return { success: true };
  },
};

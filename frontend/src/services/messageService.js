import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — Message Service
 * Mehdi'nin Branch'i (DTO/Message/) ile %100 senkronize
 * 
 * Model:
 * - id: int
 * - companyId: int
 * - companyName: string
 * - fullName: string
 * - email: string
 * - phone: string?
 * - subject: string
 * - content: string
 * - userId: int?
 * - senderUserName: string?
 * - attachmentFileId: int?
 * - attachmentFileUrl: string?
 * - status: MessageStatus (New = 0, Read = 1, Replied = 2, Spam = 3, Archived = 4)
 * - adminNote: string?
 * - replyMessage: string?
 * - repliedAt: DateTime?
 * - ipAddress: string
 * - createdAt: DateTime
 */

let mockMessages = [
  {
    id: 1,
    companyId: 1,
    companyName: "TechNova Yazılım",
    fullName: "Mehmet Demir",
    email: "mehmet@example.com",
    phone: "+90 532 123 45 67",
    subject: "Kurumsal E-Ticaret ve B2B Portalı",
    content: "Şirketimiz için çok satıcılı, muhasebe ERP entegrasyonlu ve mobil uyumlu bir B2B e-ticaret platformu yaptırmak istiyoruz. Süreç ve fiyatlandırma hakkında görüşmek isteriz.",
    status: 0, // New
    statusText: "Yeni",
    adminNote: null,
    replyMessage: null,
    repliedAt: null,
    ipAddress: "192.168.1.45",
    createdAt: "2026-08-16T14:30:00Z",
  },
  {
    id: 2,
    companyId: 1,
    companyName: "TechNova Yazılım",
    fullName: "Ayşe Yılmaz",
    email: "ayse@example.com",
    phone: "+90 544 987 65 43",
    subject: "Mobil Sağlık Uygulaması Geliştirme",
    content: "Klinik hastalarımız için randevu ve reçete takip mobil uygulaması geliştirmek istiyoruz. iOS ve Android için teklif alabilir miyiz?",
    status: 1, // Read
    statusText: "Okundu",
    adminNote: "Teklif sihirbazına yönlendirildi.",
    replyMessage: null,
    repliedAt: null,
    ipAddress: "192.168.1.82",
    createdAt: "2026-08-15T11:15:00Z",
  },
  {
    id: 3,
    companyId: 1,
    companyName: "TechNova Yazılım",
    fullName: "Burak Kaya",
    email: "burak@example.com",
    phone: "+90 555 333 22 11",
    subject: "Yapay Zekâ ve Chatbot Entegrasyonu",
    content: "Mevcut CRM sistemimize GPT-4 tabanlı kurumsal müşteri destek chatbotu entegre etmek istiyoruz.",
    status: 2, // Replied
    statusText: "Cevaplandı",
    adminNote: "Toplantı tarihi belirlendi.",
    replyMessage: "Merhaba Burak Bey, talebinizle ilgili online toplantı linkini ilettik.",
    repliedAt: "2026-08-14T16:00:00Z",
    ipAddress: "192.168.1.103",
    createdAt: "2026-08-14T09:45:00Z",
  },
];

export const messageService = {
  /**
   * Tüm Mesajları Listeler (Admin)
   * Backend: GET /api/messages
   */
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 200));
      return [...mockMessages];
    }
    return await apiRequest("/messages");
  },

  /**
   * ID'ye Göre Mesaj Detayı
   * Backend: GET /api/messages/{id}
   */
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      const found = mockMessages.find((m) => m.id === Number(id));
      if (!found) throw new Error("Mesaj bulunamadı.");
      return found;
    }
    return await apiRequest(`/messages/${id}`);
  },

  /**
   * İletişim Formundan Yeni Mesaj Gönderir (Ziyaretçi)
   * Backend: POST /api/messages (MessageCreateDto)
   */
  create: async (data) => {
    if (USE_MOCK_DATA) {
      const newMsg = {
        id: Date.now(),
        companyId: data.companyId || 1,
        companyName: "TechNova Yazılım",
        fullName: data.fullName || data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || "Genel İletişim",
        content: data.content || data.message,
        status: 0,
        statusText: "Yeni",
        ipAddress: "127.0.0.1",
        createdAt: new Date().toISOString(),
      };
      mockMessages = [newMsg, ...mockMessages];
      return newMsg;
    }
    return await apiRequest("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Mesaja Yanıt Gönderir
   * Backend: POST /api/messages/{id}/reply (MessageReplyDto)
   */
  reply: async (id, replyDto) => {
    if (USE_MOCK_DATA) {
      mockMessages = mockMessages.map((m) =>
        m.id === Number(id)
          ? {
              ...m,
              status: 2, // Replied
              statusText: "Cevaplandı",
              replyMessage: replyDto.replyContent || replyDto.replyMessage,
              repliedAt: new Date().toISOString(),
            }
          : m
      );
      return { success: true, message: "Yanıtınız müşteriye e-posta ile iletildi." };
    }
    return await apiRequest(`/messages/${id}/reply`, {
      method: "POST",
      body: JSON.stringify(replyDto),
    });
  },

  /**
   * Mesaj Durumunu Günceller (Okundu, Arşivlendi, Spam vb.)
   * Backend: PATCH /api/messages/{id}/status (MessageAdminUpdateDto)
   */
  updateStatus: async (id, updateDto) => {
    if (USE_MOCK_DATA) {
      mockMessages = mockMessages.map((m) =>
        m.id === Number(id)
          ? {
              ...m,
              status: updateDto.status ?? m.status,
              adminNote: updateDto.adminNote ?? m.adminNote,
            }
          : m
      );
      return { success: true };
    }
    return await apiRequest(`/messages/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(updateDto),
    });
  },

  /**
   * Mesajı Siler
   * Backend: DELETE /api/messages/{id}
   */
  delete: async (id) => {
    if (USE_MOCK_DATA) {
      mockMessages = mockMessages.filter((m) => m.id !== Number(id));
      return { success: true };
    }
    return await apiRequest(`/messages/${id}`, { method: "DELETE" });
  },
};

export default messageService;

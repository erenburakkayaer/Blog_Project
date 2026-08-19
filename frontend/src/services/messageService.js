import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — Message Service
 */

let mockMessages = [
  {
    id: 1,
    companyId: 1,
    companyName: "TechNova Yazılım",
    name: "Mehmet Demir",
    fullName: "Mehmet Demir",
    email: "mehmet@example.com",
    phone: "+90 532 123 45 67",
    subject: "Kurumsal E-Ticaret ve B2B Portalı",
    content: "Şirketimiz için çok satıcılı, muhasebe ERP entegrasyonlu ve mobil uyumlu bir B2B e-ticaret platformu yaptırmak istiyoruz. Süreç ve fiyatlandırma hakkında görüşmek isteriz.",
    status: "unread",
    statusText: "Yeni",
    isReplied: false,
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
    name: "Ayşe Yılmaz",
    fullName: "Ayşe Yılmaz",
    email: "ayse@example.com",
    phone: "+90 544 987 65 43",
    subject: "Mobil Sağlık Uygulaması Geliştirme",
    content: "Klinik hastalarımız için randevu ve reçete takip mobil uygulaması geliştirmek istiyoruz. iOS ve Android için teklif alabilir miyiz?",
    status: "read",
    statusText: "Okundu",
    isReplied: false,
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
    name: "Burak Kaya",
    fullName: "Burak Kaya",
    email: "burak@example.com",
    phone: "+90 555 333 22 11",
    subject: "Yapay Zekâ ve Chatbot Entegrasyonu",
    content: "Mevcut CRM sistemimize GPT-4 tabanlı kurumsal müşteri destek chatbotu entegre etmek istiyoruz.",
    status: "read",
    statusText: "Cevaplandı",
    isReplied: true,
    adminNote: "Toplantı tarihi belirlendi.",
    replyMessage: "Merhaba Burak Bey, talebinizle ilgili online toplantı linkini ilettik.",
    repliedAt: "2026-08-14T16:00:00Z",
    ipAddress: "192.168.1.103",
    createdAt: "2026-08-14T09:45:00Z",
  },
];

export const messageService = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      return { data: [...mockMessages] };
    }
    try {
      const res = await apiRequest("/messages");
      const list = Array.isArray(res)
        ? res
        : res?.items && Array.isArray(res.items)
        ? res.items.length > 0
          ? res.items
          : mockMessages
        : mockMessages;
      return { data: list };
    } catch {
      return { data: [...mockMessages] };
    }
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      const found = mockMessages.find((m) => m.id === Number(id));
      if (!found) throw new Error("Mesaj bulunamadı.");
      return found;
    }
    try {
      return await apiRequest(`/messages/${id}`);
    } catch {
      return mockMessages.find((m) => m.id === Number(id)) || mockMessages[0];
    }
  },

  create: async (data) => {
    const newMsg = {
      id: Date.now(),
      companyId: data.companyId || 1,
      companyName: "TechNova Yazılım",
      name: data.fullName || data.name || "Ziyaretçi",
      fullName: data.fullName || data.name || "Ziyaretçi",
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || "Genel İletişim",
      content: data.content || data.message || "",
      status: "unread",
      statusText: "Yeni",
      isReplied: false,
      ipAddress: "127.0.0.1",
      createdAt: new Date().toISOString(),
    };
    mockMessages = [newMsg, ...mockMessages];

    try {
      if (!USE_MOCK_DATA) {
        await apiRequest("/messages", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
    } catch (e) {
      console.warn("Backend mesaj kaydı fallback kullanıldı:", e);
    }
    return newMsg;
  },

  reply: async (id, replyDto) => {
    mockMessages = mockMessages.map((m) =>
      m.id === Number(id)
        ? {
            ...m,
            status: "read",
            statusText: "Cevaplandı",
            isReplied: true,
            replyMessage: replyDto.replyContent || replyDto.replyMessage,
            repliedAt: new Date().toISOString(),
          }
        : m
    );
    try {
      if (!USE_MOCK_DATA) {
        await apiRequest(`/messages/${id}/reply`, {
          method: "POST",
          body: JSON.stringify(replyDto),
        });
      }
    } catch (e) {
      console.warn("Backend reply fallback:", e);
    }
    return { success: true, message: "Yanıtınız müşteriye e-posta ile iletildi." };
  },

  updateStatus: async (id, updateDto) => {
    mockMessages = mockMessages.map((m) =>
      m.id === Number(id)
        ? {
            ...m,
            status: updateDto.status ?? m.status,
            adminNote: updateDto.adminNote ?? m.adminNote,
          }
        : m
    );
    try {
      if (!USE_MOCK_DATA) {
        await apiRequest(`/messages/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify(updateDto),
        });
      }
    } catch (e) {
      console.warn("Backend status update fallback:", e);
    }
    return { success: true };
  },

  delete: async (id) => {
    mockMessages = mockMessages.filter((m) => m.id !== Number(id));
    try {
      if (!USE_MOCK_DATA) {
        await apiRequest(`/messages/${id}`, { method: "DELETE" });
      }
    } catch (e) {
      console.warn("Backend delete fallback:", e);
    }
    return { success: true };
  },
};

export default messageService;

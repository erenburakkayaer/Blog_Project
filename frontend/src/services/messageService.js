// src/services/messageService.js
// İletişim Mesajları Yönetimi için API Servisi

import { getStoredData, setStoredData } from "../utils/storage";

// Geçici Mock Veriler (Backend entegrasyonu tamamlanana kadar UI testleri için)
const INITIAL_MESSAGES = [
  {
    id: "1",
    fullName: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    phone: "+90 532 111 22 33",
    subject: "Kurumsal Web Yazılımı Teklifi",
    message:
      "Merhaba, şirketimiz için kapsamlı bir kurumsal web sitesi ve yönetim paneli yaptırmak istiyoruz. Detaylar ve fiyatlandırma hakkında görüşebilir miyiz?",
    status: "read", // "unread" veya "read"
    isImportant: true,
    createdAt: "2026-07-28T13:30:00.000Z",
  },
  {
    id: "2",
    fullName: "Ayşe Demir",
    email: "ayse@example.com",
    phone: "+90 505 444 55 66",
    subject: "Siber Güvenlik Danışmanlığı",
    message:
      "İyi çalışmalar. E-ticaret sitemiz için güvenlik zafiyet analizi ve penetrasyon testi hizmeti almayı düşünüyoruz. Bu konuda referanslarınız var mı?",
    status: "unread",
    isImportant: false,
    createdAt: "2026-07-29T10:15:00.000Z",
  },
  {
    id: "3",
    fullName: "Canberk Kaya",
    email: "canberk@example.com",
    phone: "+90 542 999 88 77",
    subject: "Mobil Uygulama Projesi",
    message:
      "Flutter altyapısı ile geliştirmek istediğimiz bir mobil uygulama fikrimiz var. UI/UX tasarımı ve geliştirme süreci için ortaklık kurabilir miyiz?",
    status: "unread",
    isImportant: true,
    createdAt: "2026-07-29T14:45:00.000Z",
  },
  {
    id: "4",
    fullName: "Zeynep Çelik",
    email: "zeynep@example.com",
    phone: "+90 555 333 22 11",
    subject: "SEO ve Dijital Pazarlama",
    message:
      "Web sitemizin arama motorlarında üst sıralara çıkması için SEO optimizasyonu hizmetiniz var mı? Bilgi rica ediyorum.",
    status: "read",
    isImportant: false,
    createdAt: "2026-07-27T09:20:00.000Z",
  },
];

export const messageService = {
  // Tüm mesajları getir
  getAll: async () => {
    let messages = getStoredData("messages", INITIAL_MESSAGES);
    return { data: messages };
  },

  // ID'ye göre tekil mesaj detayı getir
  getById: async (id) => {
    const messages = getStoredData("messages", INITIAL_MESSAGES);
    const message = messages.find((m) => String(m.id) === String(id));
    if (!message) throw new Error("Mesaj bulunamadı.");
    return { data: message };
  },

  // Mesajın okundu/okunmadı durumunu güncelle
  updateStatus: async (id, statusData) => {
    let messages = getStoredData("messages", INITIAL_MESSAGES);
    messages = messages.map((m) =>
      String(m.id) === String(id) ? { ...m, ...statusData } : m,
    );
    setStoredData("messages", messages);
    return { success: true };
  },

  // Önemli işaretini değiştir
  toggleImportant: async (id) => {
    let messages = getStoredData("messages", INITIAL_MESSAGES);
    messages = messages.map((m) =>
      String(m.id) === String(id) ? { ...m, isImportant: !m.isImportant } : m,
    );
    setStoredData("messages", messages);
    return { success: true };
  },

  // Mesajı sil
  delete: async (id) => {
    let messages = getStoredData("messages", INITIAL_MESSAGES);
    messages = messages.filter((m) => String(m.id) !== String(id));
    setStoredData("messages", messages);
    return { success: true };
  },
};

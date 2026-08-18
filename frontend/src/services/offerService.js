import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — Offer Service
 * Mehdi'nin Branch'i (DTO/Offer/) ile %100 senkronize
 * 
 * Model:
 * - id: int
 * - companyId: int
 * - companyName: string
 * - companyServiceId: int?
 * - companyServiceName: string
 * - requesterUserId: int
 * - requesterUserName: string
 * - contactName: string
 * - contactEmail: string
 * - contactPhone: string
 * - title: string
 * - requirementDetails: string
 * - offeredPrice: decimal?
 * - currency: string ("TL", "USD", "EUR")
 * - proposalNotes: string?
 * - status: OfferStatus (Pending=0, InReview=1, Sent=2, Accepted=3, Rejected=4, Expired=5, Canceled=6)
 * - createdAt: DateTime
 */

let mockOffers = [
  {
    id: 1,
    companyId: 1,
    companyName: "TechNova Yazılım",
    companyServiceId: 1,
    companyServiceName: "Web & SaaS Geliştirme",
    requesterUserId: 1,
    requesterUserName: "ahmet_corp",
    contactName: "Ahmet Kurt",
    contactEmail: "ahmet@kurtinsaat.com",
    contactPhone: "+90 532 111 22 33",
    title: "Kurumsal ERP & Şantiye Takip Sistemi",
    requirementDetails: "İnşaat projelerimizin malzeme, hakediş ve personel puantajlarını takip edeceğimiz bulut tabanlı bir sistem.",
    offeredPrice: 150000.0,
    currency: "TL",
    proposalNotes: "React + .NET 10 mimarisi ile 3 ayda teslimat planlanmaktadır.",
    status: 1, // InReview
    statusName: "İnceleniyor",
    createdAt: "2026-08-14T11:30:00Z",
  },
  {
    id: 2,
    companyId: 1,
    companyName: "TechNova Yazılım",
    companyServiceId: 3,
    companyServiceName: "Yapay Zekâ ve LLM Entegrasyonu",
    requesterUserId: 2,
    requesterUserName: "selin_ecom",
    contactName: "Selin Şahin",
    contactEmail: "selin@ecomexpress.com",
    contactPhone: "+90 544 555 66 77",
    title: "Müşteri Destek AI Asistanı",
    requirementDetails: "E-ticaret sitemizdeki ürünleri ve iade politikalarını öğrenip 7/24 müşterilere cevap verecek AI botu.",
    offeredPrice: 45000.0,
    currency: "TL",
    proposalNotes: "GPT-4o fine-tuning ve canlı entegrasyon dahil fiyatlandırıldı.",
    status: 2, // Sent (Teklif İletildi)
    statusName: "Teklif İletildi",
    createdAt: "2026-08-16T15:20:00Z",
  },
];

export const offerService = {
  /**
   * Yeni Teklif Talebi Oluşturur (Ziyaretçi / Müşteri)
   * Backend: POST /api/offers (OfferCreateDto)
   */
  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 400));
      const newOffer = {
        id: Date.now(),
        companyId: data.companyId || 1,
        companyName: "TechNova Yazılım",
        companyServiceId: data.companyServiceId || 1,
        companyServiceName: data.serviceName || "Özel Yazılım",
        contactName: data.contactName || data.name,
        contactEmail: data.contactEmail || data.email,
        contactPhone: data.contactPhone || data.phone,
        title: data.title || "Özel Proje Teklifi",
        requirementDetails: data.requirementDetails || data.details || data.message || "",
        offeredPrice: null,
        currency: "TL",
        status: 0, // Pending
        statusName: "Beklemede",
        createdAt: new Date().toISOString(),
      };
      mockOffers = [newOffer, ...mockOffers];
      return { success: true, message: "Teklif talebiniz başarıyla iletildi!", offer: newOffer };
    }

    return await apiRequest("/offers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Tüm Teklif Taleplerini Listeler (Admin)
   * Backend: GET /api/offers
   */
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 200));
      return [...mockOffers];
    }
    return await apiRequest("/offers");
  },

  /**
   * ID'ye Göre Teklif Detayı
   * Backend: GET /api/offers/{id}
   */
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      const found = mockOffers.find((o) => o.id === Number(id));
      if (!found) throw new Error("Teklif bulunamadı.");
      return found;
    }
    return await apiRequest(`/offers/${id}`);
  },

  /**
   * Teklif Durumunu ve Fiyatını Günceller
   * Backend: PATCH /api/offers/{id}/status (OfferStatusUpdateDto)
   */
  updateStatus: async (id, statusData) => {
    if (USE_MOCK_DATA) {
      mockOffers = mockOffers.map((o) =>
        o.id === Number(id)
          ? {
              ...o,
              status: statusData.status ?? o.status,
              offeredPrice: statusData.offeredPrice ?? o.offeredPrice,
              proposalNotes: statusData.proposalNotes ?? o.proposalNotes,
            }
          : o
      );
      return { success: true, message: "Teklif durumu güncellendi." };
    }

    return await apiRequest(`/offers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(statusData),
    });
  },
};

export default offerService;

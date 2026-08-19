import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — Page Service
 * Mehdi'nin Branch'i (DTO/Page/) ile %100 senkronize
 * 
 * Model:
 * - id: int
 * - title: string
 * - slug: string
 * - summary: string?
 * - content: string?
 * - type: PageType (Static=0, Dynamic=1, Custom=2)
 * - isActive: bool
 * - showInHeader: bool
 * - showInFooter: bool
 * - displayOrder: int
 * - bannerImageUrl: string?
 * - createdAt: DateTime
 */

let mockPages = [
  {
    id: 1,
    title: "Hakkımızda",
    slug: "hakkimizda",
    summary: "Uslukılıç Yazılım & TechNova vizyonu ve mühendislik kadrosu.",
    content: "TechNova, Bozok Teknopark bünyesinde kurumsal dijital dönüşüm ve AI çözümleri üreten yenilikçi bir teknoloji şirketidir.",
    type: 0,
    isActive: true,
    showInHeader: true,
    showInFooter: true,
    displayOrder: 1,
    bannerImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Gizlilik ve Güvenlik Politikası",
    slug: "gizlilik-politikasi",
    summary: "Kişisel verilerin korunması ve KVKK uyumluluk şartları.",
    content: "TechNova platformu üzerinden paylaşılan tüm kişisel ve kurumsal veriler 256-bit SSL ve ISO 27001 standartlarında korunmaktadır.",
    type: 0,
    isActive: true,
    showInHeader: false,
    showInFooter: true,
    displayOrder: 2,
    bannerImageUrl: null,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

export const pageService = {
  /**
   * Header ve Footer Menü Sayfalarını Getirir
   * Backend: GET /api/pages/navigation
   */
  getNavigation: async () => {
    if (USE_MOCK_DATA) {
      return {
        header: mockPages.filter((p) => p.isActive && p.showInHeader),
        footer: mockPages.filter((p) => p.isActive && p.showInFooter),
      };
    }
    return await apiRequest("/pages/navigation");
  },

  /**
   * Slug'a Göre Sayfa Getirir
   * Backend: GET /api/pages/slug/{slug}
   */
  getBySlug: async (slug) => {
    if (USE_MOCK_DATA) {
      const page = mockPages.find((p) => p.slug === slug);
      if (!page) throw new Error("Sayfa bulunamadı.");
      return page;
    }
    return await apiRequest(`/pages/slug/${slug}`);
  },

  /**
   * Tüm Sayfaları Listeler (Admin)
   * Backend: GET /api/pages/all
   */
  getAll: async () => {
    if (USE_MOCK_DATA) {
      return [...mockPages];
    }
    return await apiRequest("/pages/all");
  },

  /**
   * Yeni Sayfa Oluşturur
   * Backend: POST /api/pages (PageCreateDto)
   */
  create: async (data) => {
    if (USE_MOCK_DATA) {
      const newPage = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockPages = [...mockPages, newPage];
      return newPage;
    }
    return await apiRequest("/pages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Sayfayı Günceller
   * Backend: PUT /api/pages/{id} (PageUpdateDto)
   */
  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      mockPages = mockPages.map((p) => (p.id === Number(id) ? { ...p, ...data } : p));
      return mockPages.find((p) => p.id === Number(id));
    }
    return await apiRequest(`/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Sayfayı Siler
   * Backend: DELETE /api/pages/{id}
   */
  delete: async (id) => {
    if (USE_MOCK_DATA) {
      mockPages = mockPages.filter((p) => p.id !== Number(id));
      return { success: true };
    }
    return await apiRequest(`/pages/${id}`, { method: "DELETE" });
  },
};

export default pageService;

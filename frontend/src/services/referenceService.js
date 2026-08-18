import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — Reference Service
 * Mehdi'nin Branch'i (DTO/Reference/) ile %100 senkronize
 * 
 * Model:
 * - id: int
 * - name: string
 * - logoUrl: string
 * - logoFileAssetId: int
 * - websiteUrl: string
 * - sector: string
 * - type: ReferenceType (Customer = 0, Partner = 1, SolutionPartner = 2)
 * - displayOrder: int
 * - isShowOnHome: bool
 * - isActive: bool
 * - createdAt: DateTime
 */

let mockReferences = [
  {
    id: 1,
    name: "Bozok Teknopark",
    logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200",
    websiteUrl: "https://bozokteknopark.com.tr",
    sector: "Teknoloji & Ar-Ge",
    type: 1, // Partner
    displayOrder: 1,
    isShowOnHome: true,
    isActive: true,
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: 2,
    name: "FinBank A.Ş.",
    logoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200",
    websiteUrl: "https://finbank.example.com",
    sector: "Finans & Bankacılık",
    type: 0, // Customer
    displayOrder: 2,
    isShowOnHome: true,
    isActive: true,
    createdAt: "2026-02-15T11:00:00Z",
  },
  {
    id: 3,
    name: "Uslukılıç Sağlık Grubu",
    logoUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200",
    websiteUrl: "https://uslukilic.example.com",
    sector: "Sağlık & Medikal",
    type: 0, // Customer
    displayOrder: 3,
    isShowOnHome: true,
    isActive: true,
    createdAt: "2026-03-20T09:00:00Z",
  },
  {
    id: 4,
    name: "Global AI Solutions",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
    websiteUrl: "https://globalai.example.com",
    sector: "Yapay Zekâ",
    type: 2, // SolutionPartner
    displayOrder: 4,
    isShowOnHome: true,
    isActive: true,
    createdAt: "2026-04-05T14:00:00Z",
  },
];

export const referenceService = {
  /**
   * Aktif ve Ana Sayfada Gösterilecek Referansları Getirir
   * Backend: GET /api/references/home
   */
  getHomeReferences: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 150));
      return mockReferences.filter((r) => r.isActive && r.isShowOnHome);
    }
    return await apiRequest("/references/home");
  },

  /**
   * Tüm Aktif Referansları Getirir (Ziyaretçiye Açık)
   * Backend: GET /api/references
   */
  getActive: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 200));
      return mockReferences.filter((r) => r.isActive);
    }
    return await apiRequest("/references");
  },

  /**
   * Tüm Referansları Listeler (Admin)
   * Backend: GET /api/references/all
   */
  getAll: async () => {
    if (USE_MOCK_DATA) {
      return [...mockReferences];
    }
    return await apiRequest("/references/all");
  },

  /**
   * Yeni Referans Ekler
   * Backend: POST /api/references (ReferenceCreateDto)
   */
  create: async (data) => {
    if (USE_MOCK_DATA) {
      const newRef = {
        id: Date.now(),
        name: data.name,
        logoUrl: data.logoUrl || "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200",
        logoFileAssetId: data.logoFileAssetId || 1,
        websiteUrl: data.websiteUrl || "",
        sector: data.sector || "Teknoloji",
        type: Number(data.type) || 0,
        displayOrder: Number(data.displayOrder) || mockReferences.length + 1,
        isShowOnHome: data.isShowOnHome ?? true,
        isActive: data.isActive ?? true,
        createdAt: new Date().toISOString(),
      };
      mockReferences = [...mockReferences, newRef];
      return newRef;
    }
    return await apiRequest("/references", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Referansı Günceller
   * Backend: PUT /api/references/{id} (ReferenceUpdateDto)
   */
  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      mockReferences = mockReferences.map((r) => (r.id === Number(id) ? { ...r, ...data } : r));
      return mockReferences.find((r) => r.id === Number(id));
    }
    return await apiRequest(`/references/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Referansı Siler
   * Backend: DELETE /api/references/{id}
   */
  delete: async (id) => {
    if (USE_MOCK_DATA) {
      mockReferences = mockReferences.filter((r) => r.id !== Number(id));
      return { success: true };
    }
    return await apiRequest(`/references/${id}`, { method: "DELETE" });
  },
};

export default referenceService;

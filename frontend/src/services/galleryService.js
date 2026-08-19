import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — GalleryItem Service
 * Mehdi'nin Branch'i (DTO/GalleyItem/) ile %100 senkronize
 * 
 * Model:
 * - id: int
 * - companyId: int
 * - companyName: string
 * - fileAssetId: int
 * - imageUrl: string
 * - title: string?
 * - description: string?
 * - displayOrder: int
 * - isActive: bool
 * - isFeatured: bool
 * - createdAt: DateTime
 */

let mockGallery = [
  {
    id: 1,
    companyId: 1,
    companyName: "TechNova Yazılım",
    fileAssetId: 1,
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
    title: "Bozok Teknopark Ofisimiz",
    description: "Yazılım geliştirme ve Ar-Ge ekibimizin çalışma ortamı.",
    displayOrder: 1,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: 2,
    companyId: 1,
    companyName: "TechNova Yazılım",
    fileAssetId: 2,
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600",
    title: "Yapay Zekâ Hackathon Etkinliği",
    description: "Üniversite öğrencileriyle gerçekleştirdiğimiz AI hackathon.",
    displayOrder: 2,
    isActive: true,
    isFeatured: true,
    createdAt: "2026-02-20T14:00:00Z",
  },
];

export const galleryService = {
  /**
   * Aktif Galeri Görsellerini Listeler
   * Backend: GET /api/galleryitems
   */
  getActive: async () => {
    if (USE_MOCK_DATA) {
      return mockGallery.filter((g) => g.isActive);
    }
    return await apiRequest("/galleryitems");
  },

  /**
   * Tüm Galeri Görsellerini Listeler (Admin)
   * Backend: GET /api/galleryitems/all
   */
  getAll: async () => {
    if (USE_MOCK_DATA) {
      return [...mockGallery];
    }
    return await apiRequest("/galleryitems/all");
  },

  /**
   * Yeni Galeri Görseli Ekler
   * Backend: POST /api/galleryitems (GalleryItemCreateDto)
   */
  create: async (data) => {
    if (USE_MOCK_DATA) {
      const newItem = {
        id: Date.now(),
        companyId: data.companyId || 1,
        companyName: "TechNova Yazılım",
        fileAssetId: data.fileAssetId || 1,
        imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
        title: data.title || "",
        description: data.description || "",
        displayOrder: Number(data.displayOrder) || mockGallery.length + 1,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        createdAt: new Date().toISOString(),
      };
      mockGallery = [...mockGallery, newItem];
      return newItem;
    }
    return await apiRequest("/galleryitems", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Görseli Siler
   * Backend: DELETE /api/galleryitems/{id}
   */
  delete: async (id) => {
    if (USE_MOCK_DATA) {
      mockGallery = mockGallery.filter((g) => g.id !== Number(id));
      return { success: true };
    }
    return await apiRequest(`/galleryitems/${id}`, { method: "DELETE" });
  },
};

export default galleryService;

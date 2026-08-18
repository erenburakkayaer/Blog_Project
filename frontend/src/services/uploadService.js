import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — FileAsset Service
 * Mehdi'nin Branch'i (DTO/FileAsset/) ile %100 senkronize
 * 
 * Model:
 * - id: int
 * - originalFileName: string
 * - url: string
 * - contentType: string
 * - fileSizeBytes: long
 * - fileCategory: string (Images, Documents, SourceCode, Releases)
 * - uploadedByUserId: int
 * - uploadedByUserName: string
 * - uploadedAt: DateTime
 */

export const uploadService = {
  /**
   * Dosya Yükler (Görsel, Zip, PDF, APK vb.)
   * Backend: POST /api/fileassets/upload
   */
  uploadFile: async (file, category = "General") => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const objectUrl = URL.createObjectURL(file);
      return {
        id: Date.now(),
        originalFileName: file.name,
        url: objectUrl,
        contentType: file.type || "application/octet-stream",
        fileSizeBytes: file.size,
        fileCategory: category,
        uploadedByUserId: 1,
        uploadedByUserName: "Samet Başkale",
        uploadedAt: new Date().toISOString(),
      };
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileCategory", category);

    return await apiRequest("/fileassets/upload", {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Tüm Yüklenen Dosyaları Listeler (Admin)
   * Backend: GET /api/fileassets
   */
  getAll: async () => {
    if (USE_MOCK_DATA) {
      return [];
    }
    return await apiRequest("/fileassets");
  },

  /**
   * Dosyayı Siler
   * Backend: DELETE /api/fileassets/{id}
   */
  deleteFile: async (id) => {
    if (USE_MOCK_DATA) {
      return { success: true };
    }
    return await apiRequest(`/fileassets/${id}`, { method: "DELETE" });
  },
};

export default uploadService;

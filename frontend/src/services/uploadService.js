import { USE_MOCK_DATA, apiRequest } from "./api";

/**
 * TechNova Upload Service
 *
 * Desteklenen formatlar: .zip, .apk, .pdf, .png, .jpg, .mp4 vb.
 * Backend: POST /api/upload (Multipart Form Data)
 * Response: { success, fileName, fileSize, url }
 */
export const uploadService = {
  uploadFile: async (file, folder = "projects") => {
    if (!file) throw new Error("Dosya seçilmedi.");

    if (USE_MOCK_DATA) {
      // Simulate 500ms upload delay
      await new Promise((res) => setTimeout(res, 500));
      const mockUrl = URL.createObjectURL(file);
      return {
        success: true,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        url: mockUrl,
        folder,
      };
    }

    const token = localStorage.getItem("technova_token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch(
      `${import.meta.env?.VITE_API_URL || "http://localhost:5000/api"}/upload`,
      {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Dosya yükleme başarısız oldu. Lütfen tekrar deneyin.");
    }

    return await response.json();
  },

  /**
   * Delete a file from server
   * Backend: DELETE /api/upload/:fileId
   */
  deleteFile: async (fileUrl) => {
    if (USE_MOCK_DATA) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true };
    }
    return await apiRequest(`/upload/delete`, {
      method: "DELETE",
      body: JSON.stringify({ url: fileUrl }),
    });
  },
};

export default uploadService;

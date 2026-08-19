import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — Blog Service
 * Mehdi'nin Branch'i (feature/database-setup-mehdi) DTO ve Entity modelleriyle %100 senkronize
 * 
 * Model:
 * - id: int
 * - title: string
 * - content: string
 * - authorName: string
 * - authorId: int
 * - categoryId: int
 * - categoryName: string
 * - coverImageUrl: string
 * - coverImageAssetId: int?
 * - isPublished: bool
 * - createdAt: DateTime
 * - commentCount: int
 */

let mockBlogs = [
  {
    id: 1,
    title: "React 19'un Getirdikleri: Concurrent Mode ve Beyond",
    content: "React 19 ile gelen yeni özellikler, Server Components, Action hook'ları ve performans iyileştirmeleri hakkında kapsamlı rehber.",
    excerpt: "React 19 ile gelen yeni özellikler, Server Components ve performans iyileştirmeleri hakkında kapsamlı rehber.",
    authorId: 1,
    authorName: "Samet Başkale",
    categoryId: 1,
    categoryName: "Web",
    category: "Web",
    coverImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    isPublished: true,
    status: "published",
    readTime: "6 dk",
    createdAt: "2026-08-12T10:00:00Z",
    monetization: "₺350 Kazandırdı",
    commentCount: 8,
  },
  {
    id: 2,
    title: "GPT-4o ile Kurumsal Chatbot Nasıl Kurulur?",
    content: "Adım adım OpenAI API entegrasyonu, RAG mimarisi ve kurumsal müşteri hizmetleri kullanım senaryoları.",
    excerpt: "Adım adım OpenAI API entegrasyonu ve kurumsal kullanım senaryoları.",
    authorId: 2,
    authorName: "Mustafa Aydın",
    categoryId: 3,
    categoryName: "Yapay Zekâ",
    category: "Yapay Zekâ",
    coverImageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400",
    isPublished: true,
    status: "published",
    readTime: "9 dk",
    createdAt: "2026-08-05T09:00:00Z",
    monetization: "₺620 Kazandırdı",
    commentCount: 14,
  },
  {
    id: 3,
    title: "2026'da Siber Güvenlik Trendleri",
    content: "Zero-trust mimarisi, AI tabanlı tehdit algılama ve yeni nesil saldırı vektörlerine karşı koruma stratejileri.",
    excerpt: "Zero-trust mimarisi, AI tabanlı tehdit algılama ve yeni saldırı vektörleri.",
    authorId: 1,
    authorName: "Uslukılıç Security",
    categoryId: 4,
    categoryName: "Güvenlik",
    category: "Güvenlik",
    coverImageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400",
    isPublished: true,
    status: "published",
    readTime: "7 dk",
    createdAt: "2026-07-28T08:00:00Z",
    monetization: "₺480 Kazandırdı",
    commentCount: 5,
  },
  {
    id: 4,
    title: "Flutter vs React Native: 2026 Karşılaştırması",
    content: "Performans, ekosistem, iş gücü ve geliştirici deneyimi açısından güncel mobil çatı değerlendirmesi.",
    excerpt: "Performans, ekosistem ve iş gücü açısından güncel bir değerlendirme.",
    authorId: 3,
    authorName: "Elif Aksoy",
    categoryId: 2,
    categoryName: "Mobil",
    category: "Mobil",
    coverImageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
    isPublished: false,
    status: "draft",
    readTime: "8 dk",
    createdAt: "2026-07-20T11:00:00Z",
    monetization: "₺0 (Taslak)",
    commentCount: 0,
  },
];

export const blogService = {
  /**
   * Tüm Yayındaki Blogları Getirir
   * Backend: GET /api/blogs
   */
  getPublished: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 200));
      return mockBlogs.filter((b) => b.isPublished);
    }
    return await apiRequest("/blogs");
  },

  /**
   * Tüm Blogları Getirir (Admin)
   * Backend: GET /api/blogs/all
   */
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 250));
      return [...mockBlogs];
    }
    return await apiRequest("/blogs/all");
  },

  getAllBlogs: async () => blogService.getAll(),

  /**
   * ID'ye Göre Tekil Blog Getirir
   * Backend: GET /api/blogs/{id}
   */
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      const found = mockBlogs.find((b) => b.id === Number(id));
      if (!found) throw new Error("Blog yazısı bulunamadı.");
      return found;
    }
    return await apiRequest(`/blogs/${id}`);
  },

  /**
   * Kategoriye Göre Blogları Getirir
   * Backend: GET /api/blogs/category/{categoryId}
   */
  getByCategory: async (categoryId) => {
    if (USE_MOCK_DATA) {
      return mockBlogs.filter((b) => b.categoryId === Number(categoryId) && b.isPublished);
    }
    return await apiRequest(`/blogs/category/${categoryId}`);
  },

  /**
   * Yeni Blog Oluşturur
   * Backend: POST /api/blogs (BlogCreateDto)
   */
  createBlog: async (blogData) => {
    if (USE_MOCK_DATA) {
      const newBlog = {
        id: Date.now(),
        title: blogData.title,
        content: blogData.content || blogData.excerpt || "",
        excerpt: blogData.excerpt || (blogData.content ? blogData.content.slice(0, 140) + "..." : ""),
        authorId: blogData.authorId || 1,
        authorName: blogData.authorName || "Samet Başkale",
        categoryId: Number(blogData.categoryId) || 1,
        categoryName: blogData.categoryName || blogData.category || "Genel",
        category: blogData.category || blogData.categoryName || "Genel",
        coverImageUrl: blogData.coverImageUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400",
        isPublished: blogData.isPublished ?? true,
        status: blogData.isPublished ? "published" : "draft",
        readTime: "5 dk",
        createdAt: new Date().toISOString(),
        monetization: "₺0 Kazandırdı (Yeni)",
        commentCount: 0,
      };
      mockBlogs = [newBlog, ...mockBlogs];
      return newBlog;
    }

    return await apiRequest("/blogs", {
      method: "POST",
      body: JSON.stringify({
        title: blogData.title,
        categoryId: Number(blogData.categoryId) || 1,
        content: blogData.content || blogData.excerpt,
        coverImageAssetId: blogData.coverImageAssetId || null,
        isPublished: blogData.isPublished ?? true,
      }),
    });
  },

  create: async (data) => blogService.createBlog(data),

  /**
   * Mevcut Blogu Günceller
   * Backend: PUT /api/blogs/{id} (BlogUpdateDto)
   */
  updateBlog: async (id, updatedFields) => {
    if (USE_MOCK_DATA) {
      mockBlogs = mockBlogs.map((b) =>
        b.id === Number(id)
          ? {
              ...b,
              ...updatedFields,
              isPublished: updatedFields.isPublished ?? b.isPublished,
              status: (updatedFields.isPublished ?? b.isPublished) ? "published" : "draft",
            }
          : b
      );
      return mockBlogs.find((b) => b.id === Number(id));
    }

    return await apiRequest(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedFields),
    });
  },

  update: async (id, data) => blogService.updateBlog(id, data),

  /**
   * Blogu Yayınlar
   * Backend: PATCH /api/blogs/{id}/publish
   */
  publishBlog: async (id) => {
    if (USE_MOCK_DATA) {
      return blogService.updateBlog(id, { isPublished: true, status: "published" });
    }
    return await apiRequest(`/blogs/${id}/publish`, { method: "PATCH" });
  },

  /**
   * Blogu Yayından Kaldırır
   * Backend: PATCH /api/blogs/{id}/unpublish
   */
  unpublishBlog: async (id) => {
    if (USE_MOCK_DATA) {
      return blogService.updateBlog(id, { isPublished: false, status: "draft" });
    }
    return await apiRequest(`/blogs/${id}/unpublish`, { method: "PATCH" });
  },

  /**
   * Blogu Siler (Soft Delete)
   * Backend: DELETE /api/blogs/{id}
   */
  deleteBlog: async (id) => {
    if (USE_MOCK_DATA) {
      mockBlogs = mockBlogs.filter((b) => b.id !== Number(id));
      return { success: true, message: "Blog başarıyla silindi." };
    }
    return await apiRequest(`/blogs/${id}`, { method: "DELETE" });
  },

  delete: async (id) => blogService.deleteBlog(id),

  /**
   * Başlık veya İçeriğe Göre Arama
   * Backend: GET /api/blogs/search?keyword=...
   */
  search: async (keyword) => {
    if (USE_MOCK_DATA) {
      const q = keyword.toLowerCase();
      return mockBlogs.filter((b) => b.title.toLowerCase().includes(q) || b.content.toLowerCase().includes(q));
    }
    return await apiRequest(`/blogs/search?keyword=${encodeURIComponent(keyword)}`);
  },
};

export default blogService;

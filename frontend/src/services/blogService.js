import { apiRequest, USE_MOCK_DATA } from "./api";

let mockBlogs = [
  {
    id: 1,
    title: "React 19'un Getirdikleri: Concurrent Mode ve Beyond",
    category: "Web",
    status: "published",
    readTime: "6 dk",
    date: "12 Ağu 2026",
    icon: "bi-code-slash",
    color: "#6366f1",
    monetization: "₺350 Kazandırdı",
    author: "Samet Başkale",
    excerpt: "React 19 ile gelen yeni özellikler, Server Components ve performans iyileştirmeleri hakkında kapsamlı rehber.",
    createdAt: "2026-08-12T10:00:00Z",
    updatedAt: "2026-08-12T10:00:00Z",
  },
  {
    id: 2,
    title: "GPT-4o ile Kurumsal Chatbot Nasıl Kurulur?",
    category: "Yapay Zekâ",
    status: "published",
    readTime: "9 dk",
    date: "5 Ağu 2026",
    icon: "bi-cpu",
    color: "#34d399",
    monetization: "₺620 Kazandırdı",
    author: "Mustafa Aydın",
    excerpt: "Adım adım OpenAI API entegrasyonu ve kurumsal kullanım senaryoları.",
    createdAt: "2026-08-05T09:00:00Z",
    updatedAt: "2026-08-05T09:00:00Z",
  },
  {
    id: 3,
    title: "2026'da Siber Güvenlik Trendleri",
    category: "Güvenlik",
    status: "published",
    readTime: "7 dk",
    date: "28 Tem 2026",
    icon: "bi-shield-check",
    color: "#ef4444",
    monetization: "₺480 Kazandırdı",
    author: "Uslukılıç Security",
    excerpt: "Zero-trust mimarisi, AI tabanlı tehdit algılama ve yeni saldırı vektörleri.",
    createdAt: "2026-07-28T08:00:00Z",
    updatedAt: "2026-07-28T08:00:00Z",
  },
  {
    id: 4,
    title: "Flutter vs React Native: 2026 Karşılaştırması",
    category: "Mobil",
    status: "draft",
    readTime: "8 dk",
    date: "20 Tem 2026",
    icon: "bi-phone",
    color: "#38bdf8",
    monetization: "₺0 (Taslak)",
    author: "Elif Aksoy",
    excerpt: "Performans, ekosistem ve iş gücü açısından güncel bir değerlendirme.",
    createdAt: "2026-07-20T11:00:00Z",
    updatedAt: "2026-07-20T11:00:00Z",
  },
];

export const blogService = {
  /**
   * GET ALL BLOGS
   * Admin BlogListPage ve Dashboard tarafından kullanılır.
   * Backend: GET /api/blogs
   */
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 300));
      return [...mockBlogs];
    }
    return await apiRequest("/blogs");
  },

  // Alias — eski kodlar için uyumluluk
  getAllBlogs: async () => {
    if (USE_MOCK_DATA) return [...mockBlogs];
    return await apiRequest("/blogs");
  },

  /**
   * CREATE BLOG
   * Backend: POST /api/blogs → { id, title, ... }
   */
  createBlog: async (blogData) => {
    if (USE_MOCK_DATA) {
      const newBlog = {
        id: Date.now(),
        status: "published",
        date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" }),
        icon: "bi-file-text",
        color: "#6366f1",
        monetization: "₺0 Kazandırdı (Yeni)",
        author: blogData.author || "Yazar",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...blogData,
      };
      mockBlogs = [newBlog, ...mockBlogs];
      return newBlog;
    }
    return await apiRequest("/blogs", {
      method: "POST",
      body: JSON.stringify(blogData),
    });
  },

  /**
   * UPDATE BLOG
   * Backend: PUT /api/blogs/:id
   */
  updateBlog: async (id, updatedFields) => {
    if (USE_MOCK_DATA) {
      mockBlogs = mockBlogs.map((b) =>
        b.id === Number(id) ? { ...b, ...updatedFields, updatedAt: new Date().toISOString() } : b
      );
      return mockBlogs.find((b) => b.id === Number(id));
    }
    return await apiRequest(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedFields),
    });
  },

  /**
   * GET BY ID
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
   * DELETE BLOG
   * Backend: DELETE /api/blogs/:id
   */
  deleteBlog: async (id) => {
    if (USE_MOCK_DATA) {
      mockBlogs = mockBlogs.filter((b) => b.id !== Number(id));
      return { success: true, message: "Blog başarıyla silindi." };
    }
    return await apiRequest(`/blogs/${id}`, { method: "DELETE" });
  },

  // Aliases for standard CRUD naming
  create: async (blogData) => blogService.createBlog(blogData),
  update: async (id, updatedFields) => blogService.updateBlog(id, updatedFields),
  delete: async (id) => blogService.deleteBlog(id),
};

export default blogService;

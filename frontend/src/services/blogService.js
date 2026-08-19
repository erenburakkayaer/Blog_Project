import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — Blog Service
 */

let mockBlogs = [
  {
    id: 1,
    title: "React 19'un Getirdikleri: Concurrent Mode ve Beyond",
    content: "React 19 ile gelen yeni özellikler, Server Components, Action hook'ları ve performans iyileştirmeleri hakkında kapsamlı rehber. Bu yazıda yeni hook'lar (useActionState, useOptimistic), Compiler optimizasyonları ve asset pre-loading tekniklerini inceleyeceğiz.",
    summary: "React 19 ile gelen yeni özellikler, Server Components ve performans iyileştirmeleri hakkında kapsamlı rehber.",
    excerpt: "React 19 ile gelen yeni özellikler, Server Components ve performans iyileştirmeleri hakkında kapsamlı rehber.",
    authorId: 1,
    authorName: "Samet Başkale",
    authorUsername: "samet_admin",
    categoryId: 1,
    categoryName: "Web",
    category: "Web",
    coverImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
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
    content: "Adım adım OpenAI API entegrasyonu, RAG (Retrieval-Augmented Generation) mimarisi ve kurumsal müşteri hizmetleri kullanım senaryoları. Kendi dokümanlarınızı embedding vektörlerine dönüştürüp akıllı arama yapmayı öğrenin.",
    summary: "Adım adım OpenAI API entegrasyonu ve kurumsal kullanım senaryoları.",
    excerpt: "Adım adım OpenAI API entegrasyonu ve kurumsal kullanım senaryoları.",
    authorId: 2,
    authorName: "Mustafa Aydın",
    authorUsername: "zeynep_yazar",
    categoryId: 3,
    categoryName: "Yapay Zekâ",
    category: "Yapay Zekâ",
    coverImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad99a?w=800",
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
    content: "Zero-trust mimarisi, AI tabanlı tehdit algılama ve yeni nesil saldırı vektörlerine karşı koruma stratejileri. Kurumsal altyapınızı nasıl güvence altına alabilirsiniz?",
    summary: "Zero-trust mimarisi, AI tabanlı tehdit algılama ve yeni saldırı vektörleri.",
    excerpt: "Zero-trust mimarisi, AI tabanlı tehdit algılama ve yeni saldırı vektörleri.",
    authorId: 1,
    authorName: "Uslukılıç Security",
    authorUsername: "eren_dev",
    categoryId: 4,
    categoryName: "Güvenlik",
    category: "Güvenlik",
    coverImageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
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
    summary: "Performans, ekosistem ve iş gücü açısından güncel bir değerlendirme.",
    excerpt: "Performans, ekosistem ve iş gücü açısından güncel bir değerlendirme.",
    authorId: 3,
    authorName: "Elif Aksoy",
    authorUsername: "eren_dev",
    categoryId: 2,
    categoryName: "Mobil",
    category: "Mobil",
    coverImageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    isPublished: false,
    status: "draft",
    readTime: "8 dk",
    createdAt: "2026-07-20T11:00:00Z",
    monetization: "₺0 (Taslak)",
    commentCount: 0,
  },
];

export const blogService = {
  getPublished: async () => {
    if (USE_MOCK_DATA) {
      return mockBlogs.filter((b) => b.isPublished);
    }
    try {
      const res = await apiRequest("/blogs");
      if (Array.isArray(res)) return res;
      if (res?.items && Array.isArray(res.items)) return res.items.length > 0 ? res.items : mockBlogs.filter((b) => b.isPublished);
      return mockBlogs.filter((b) => b.isPublished);
    } catch {
      return mockBlogs.filter((b) => b.isPublished);
    }
  },

  getAll: async () => {
    if (USE_MOCK_DATA) {
      return [...mockBlogs];
    }
    try {
      const res = await apiRequest("/blogs");
      if (Array.isArray(res)) return res;
      if (res?.items && Array.isArray(res.items)) return res.items.length > 0 ? res.items : mockBlogs;
      return [...mockBlogs];
    } catch {
      return [...mockBlogs];
    }
  },

  getAllBlogs: async () => blogService.getAll(),

  getById: async (id) => {
    const numId = Number(id);
    const localMatch = mockBlogs.find((b) => b.id === numId || b.id.toString() === id?.toString());
    
    if (USE_MOCK_DATA) {
      return localMatch || mockBlogs[0];
    }

    try {
      const res = await apiRequest(`/blogs/${id}`);
      if (res && res.title) return res;
      return localMatch || mockBlogs[0];
    } catch {
      return localMatch || mockBlogs[0];
    }
  },

  getByCategory: async (categoryId) => {
    if (USE_MOCK_DATA) {
      return mockBlogs.filter((b) => b.categoryId === Number(categoryId) && b.isPublished);
    }
    try {
      const res = await apiRequest(`/blogs/category/${categoryId}`);
      return Array.isArray(res) ? res : mockBlogs.filter((b) => b.categoryId === Number(categoryId));
    } catch {
      return mockBlogs.filter((b) => b.categoryId === Number(categoryId));
    }
  },

  createBlog: async (blogData) => {
    const newBlog = {
      id: Date.now(),
      title: blogData.title,
      content: blogData.content,
      excerpt: blogData.summary || blogData.excerpt || blogData.content?.slice(0, 120),
      summary: blogData.summary || blogData.excerpt,
      authorId: 1,
      authorName: blogData.authorName || "Samet Başkale",
      categoryId: Number(blogData.categoryId) || 1,
      categoryName: blogData.categoryName || "Teknoloji",
      category: blogData.categoryName || "Teknoloji",
      coverImageUrl: blogData.coverImageUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      isPublished: blogData.isPublished ?? true,
      status: blogData.isPublished ? "published" : "draft",
      readTime: "5 dk",
      createdAt: new Date().toISOString(),
      monetization: "₺0 (Yeni)",
      commentCount: 0,
    };
    mockBlogs = [newBlog, ...mockBlogs];

    try {
      if (!USE_MOCK_DATA) {
        await apiRequest("/blogs", {
          method: "POST",
          body: JSON.stringify(blogData),
        });
      }
    } catch (e) {
      console.warn("Backend blog create fallback:", e);
    }
    return newBlog;
  },

  updateBlog: async (id, blogData) => {
    mockBlogs = mockBlogs.map((b) => (b.id === Number(id) ? { ...b, ...blogData } : b));
    try {
      if (!USE_MOCK_DATA) {
        await apiRequest(`/blogs/${id}`, {
          method: "PUT",
          body: JSON.stringify(blogData),
        });
      }
    } catch (e) {
      console.warn("Backend blog update fallback:", e);
    }
    return { success: true };
  },

  deleteBlog: async (id) => {
    mockBlogs = mockBlogs.filter((b) => b.id !== Number(id));
    try {
      if (!USE_MOCK_DATA) {
        await apiRequest(`/blogs/${id}`, { method: "DELETE" });
      }
    } catch (e) {
      console.warn("Backend blog delete fallback:", e);
    }
    return { success: true };
  },
};

export default blogService;

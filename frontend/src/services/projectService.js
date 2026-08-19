import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — Project Service
 * Mehdi'nin Branch'i (feature/database-setup-mehdi) Project Entity & DTO modelleriyle %100 senkronize
 * 
 * Model:
 * - id: int
 * - title: string
 * - slug: string
 * - shortDescription: string (kart özeti)
 * - description: string (detay zengin içerik)
 * - clientName: string (örn: FinBank A.Ş.)
 * - usedTechnologies: string (örn: "React 19, .NET 10, PostgreSQL")
 * - categoryId: int
 * - categoryName / category: string
 * - projectUrl: string
 * - coverImageUrl: string
 * - isFeatured: bool (Boost durumu)
 * - isActive: bool (Durum)
 * - createdAt: DateTime
 */

let mockProjects = [
  {
    id: 1,
    title: "FinTech Dashboard",
    slug: "fintech-dashboard",
    shortDescription: "Gerçek zamanlı finansal analitik ve bütçe yönetim platformu.",
    summary: "Gerçek zamanlı finansal analitik ve bütçe yönetim platformu.",
    description: "FinTech Dashboard; kurumlar ve bireysel kullanıcılar için gerçek zamanlı nakit akışı, borsa ve döviz kurları takibi sağlayan modern bir finansal analiz sistemidir. React 19 ve .NET 10 mimarisi ile yüksek performanslı veri işleme sunar.",
    clientName: "FinBank A.Ş.",
    client: "FinBank A.Ş.",
    usedTechnologies: "React 19, .NET 10, PostgreSQL, Tailwind",
    technologies: ["React 19", ".NET 10", "PostgreSQL", "Tailwind"],
    tag: "React 19 · .NET 10",
    categoryId: 1,
    categoryName: "Web",
    category: "Web",
    projectUrl: "https://fintech.technova.dev",
    coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    color: "#6366f1",
    icon: "bi-bar-chart-line",
    isFeatured: true,
    boosted: true,
    isActive: true,
    status: "published",
    author: "Ahmet Yılmaz",
    fileName: "fintech-v1.zip",
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-10T14:00:00Z",
  },
  {
    id: 2,
    title: "MedApp Mobil",
    slug: "medapp-mobil",
    shortDescription: "Hasta takip, reçete ve online randevu yönetim uygulaması.",
    summary: "Hasta takip, reçete ve online randevu yönetim uygulaması.",
    description: "iOS ve Android platformlarında çalışan MedApp Mobil; doktor-hasta iletişimini, reçete takibini ve anlık randevu oluşturma süreçlerini kolaylaştıran modern bir sağlık asistanıdır.",
    clientName: "Sağlık Merkezi",
    client: "Sağlık Merkezi",
    usedTechnologies: "React Native, Firebase, Node.js",
    technologies: ["React Native", "Firebase", "Node.js"],
    tag: "React Native · Firebase",
    categoryId: 2,
    categoryName: "Mobil",
    category: "Mobil",
    projectUrl: "https://medapp.technova.dev",
    coverImageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
    color: "#38bdf8",
    icon: "bi-heart-pulse",
    isFeatured: false,
    boosted: false,
    isActive: true,
    status: "published",
    author: "Zeynep Kaya",
    fileName: "medapp-release.apk",
    createdAt: "2026-07-20T09:00:00Z",
    updatedAt: "2026-08-05T11:00:00Z",
  },
  {
    id: 3,
    title: "AI Chatbot Platformu",
    slug: "ai-chatbot-platformu",
    shortDescription: "Kurumsal müşteri hizmetleri ve satış odaklı GPT-4 chatbot altyapısı.",
    summary: "Kurumsal müşteri hizmetleri ve satış odaklı GPT-4 chatbot altyapısı.",
    description: "TechNova AI motorunu kullanan kurumsal chatbot sistemi; web sitelerine tek satır kodla entegre olabilen, şirket dokümanlarını okuyarak akıllı yanıtlar veren yeni nesil müşteri destek çözümüdür.",
    clientName: "TechCorp Ltd.",
    client: "TechCorp Ltd.",
    usedTechnologies: "Python, GPT-4, FastAPI, PostgreSQL",
    technologies: ["Python", "GPT-4", "FastAPI", "PostgreSQL"],
    tag: "Python · GPT-4",
    categoryId: 3,
    categoryName: "Yapay Zekâ",
    category: "Yapay Zekâ",
    projectUrl: "https://ai.technova.dev",
    coverImageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400",
    color: "#34d399",
    icon: "bi-chat-square-dots",
    isFeatured: true,
    boosted: true,
    isActive: true,
    status: "published",
    author: "Samet Başkale",
    fileName: "ai-core.py",
    createdAt: "2026-07-15T08:00:00Z",
    updatedAt: "2026-08-12T16:00:00Z",
  },
  {
    id: 4,
    title: "E-Ticaret Sistemi",
    slug: "e-ticaret-sistemi",
    shortDescription: "Çok satıcılı marketplace ve güvenli ödeme altyapısı.",
    summary: "Çok satıcılı marketplace ve güvenli ödeme altyapısı.",
    description: "Next.js ve Stripe entegrasyonu ile geliştirilen e-ticaret platformu; dinamik komisyon yönetimi, kargo takibi ve anlık stok güncellemeleri sunar.",
    clientName: "MarketTR",
    client: "MarketTR",
    usedTechnologies: "Next.js, Stripe, MongoDB, Docker",
    technologies: ["Next.js", "Stripe", "MongoDB", "Docker"],
    tag: "Next.js · Stripe",
    categoryId: 1,
    categoryName: "Web",
    category: "Web",
    projectUrl: "https://shop.technova.dev",
    coverImageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400",
    color: "#f59e0b",
    icon: "bi-cart3",
    isFeatured: false,
    boosted: false,
    isActive: false,
    status: "draft",
    author: "Caner Demir",
    fileName: "shop-bundle.zip",
    createdAt: "2026-08-08T12:00:00Z",
    updatedAt: "2026-08-08T12:00:00Z",
  },
];

export const projectService = {
  /**
   * Aktif Projeleri Listeler (Ziyaretçiye Açık)
   * Backend: GET /api/projects?page=1&pageSize=20
   */
  getActive: async (page = 1, pageSize = 20) => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 200));
      return mockProjects.filter((p) => p.isActive);
    }
    return await apiRequest(`/projects?page=${page}&pageSize=${pageSize}`);
  },

  /**
   * Öne Çıkarılmış (Boosted / Featured) Projeleri Listeler
   * Backend: GET /api/projects/featured
   */
  getFeatured: async () => {
    if (USE_MOCK_DATA) {
      return mockProjects.filter((p) => p.isFeatured && p.isActive);
    }
    return await apiRequest("/projects/featured");
  },

  /**
   * Tüm Projeleri Listeler (Admin)
   * Backend: GET /api/projects/all
   */
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 200));
      return [...mockProjects];
    }
    try {
      const res = await apiRequest("/projects");
      if (Array.isArray(res)) return res;
      if (res?.items && Array.isArray(res.items)) return res.items.length > 0 ? res.items : mockProjects;
      return [...mockProjects];
    } catch {
      return [...mockProjects];
    }
  },

  getAllProjects: async () => projectService.getAll(),

  /**
   * ID'ye Göre Proje Detayı
   * Backend: GET /api/projects/{id}
   */
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      const found = mockProjects.find((p) => p.id === Number(id));
      if (!found) throw new Error("Proje bulunamadı.");
      return found;
    }
    return await apiRequest(`/projects/${id}`);
  },

  /**
   * Slug'a Göre Proje Detayı
   * Backend: GET /api/projects/slug/{slug}
   */
  getBySlug: async (slug) => {
    if (USE_MOCK_DATA) {
      const found = mockProjects.find((p) => p.slug === slug);
      if (!found) throw new Error("Proje bulunamadı.");
      return found;
    }
    return await apiRequest(`/projects/slug/${slug}`);
  },

  /**
   * Yeni Proje Oluşturur
   * Backend: POST /api/projects (ProjectCreateDto)
   */
  createProject: async (projectData) => {
    if (USE_MOCK_DATA) {
      const slug = (projectData.title || "proje")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const newProject = {
        id: Date.now(),
        title: projectData.title,
        slug,
        shortDescription: projectData.shortDescription || projectData.desc || projectData.summary || "",
        summary: projectData.shortDescription || projectData.desc || projectData.summary || "",
        description: projectData.description || projectData.desc || "",
        clientName: projectData.clientName || projectData.client || "Kurumsal",
        client: projectData.clientName || projectData.client || "Kurumsal",
        usedTechnologies: Array.isArray(projectData.technologies)
          ? projectData.technologies.join(", ")
          : projectData.usedTechnologies || "React, .NET",
        technologies: Array.isArray(projectData.technologies)
          ? projectData.technologies
          : (projectData.usedTechnologies || "React, .NET").split(", "),
        tag: projectData.tag || `${projectData.category || "Web"} · TechNova`,
        categoryId: Number(projectData.categoryId) || 1,
        categoryName: projectData.categoryName || projectData.category || "Web",
        category: projectData.category || projectData.categoryName || "Web",
        projectUrl: projectData.projectUrl || "https://technova.dev",
        coverImageUrl: projectData.coverImageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
        color: projectData.color || "#6366f1",
        icon: projectData.icon || "bi-folder2-open",
        isFeatured: false,
        boosted: false,
        isActive: true,
        status: "published",
        author: projectData.author || "Samet Başkale",
        fileName: projectData.fileName || "proje-dosyalari.zip",
        createdAt: new Date().toISOString(),
      };
      mockProjects = [newProject, ...mockProjects];
      return newProject;
    }

    return await apiRequest("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  },

  create: async (data) => projectService.createProject(data),

  /**
   * Projeyi Günceller
   * Backend: PUT /api/projects/{id}
   */
  updateProject: async (id, updatedFields) => {
    if (USE_MOCK_DATA) {
      mockProjects = mockProjects.map((p) =>
        p.id === Number(id)
          ? {
              ...p,
              ...updatedFields,
              shortDescription: updatedFields.shortDescription || updatedFields.summary || p.shortDescription,
              summary: updatedFields.shortDescription || updatedFields.summary || p.summary,
            }
          : p
      );
      return mockProjects.find((p) => p.id === Number(id));
    }

    return await apiRequest(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedFields),
    });
  },

  update: async (id, data) => projectService.updateProject(id, data),

  /**
   * Projeyi Öne Çıkarır (Boost / Feature)
   * Backend: POST /api/projects/{id}/boost
   */
  boostProject: async (id, days = 7) => {
    if (USE_MOCK_DATA) {
      mockProjects = mockProjects.map((p) =>
        p.id === Number(id) ? { ...p, isFeatured: true, boosted: true } : p
      );
      return { success: true, message: `Projeniz ${days} gün boyunca öne çıkarıldı (Boosted)!` };
    }
    return await apiRequest(`/projects/${id}/boost`, {
      method: "POST",
      body: JSON.stringify({ days }),
    });
  },

  /**
   * Projeye Ait Galeri Görsellerini Getirir
   * Backend: GET /api/projects/{projectId}/images
   */
  getProjectImages: async (projectId) => {
    if (USE_MOCK_DATA) {
      return [
        { id: 1, projectId: Number(projectId), imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", altText: "Dashboard Görünümü", isCover: true, displayOrder: 1 },
        { id: 2, projectId: Number(projectId), imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600", altText: "Raporlama Ekranı", isCover: false, displayOrder: 2 },
      ];
    }
    return await apiRequest(`/projects/${projectId}/images`);
  },

  /**
   * Projeye Yeni Galeri Görseli Ekler
   * Backend: POST /api/projects/{projectId}/images (ProjectImageCreateDto)
   */
  addProjectImage: async (projectId, imageData) => {
    if (USE_MOCK_DATA) {
      return { id: Date.now(), projectId: Number(projectId), ...imageData, createdAt: new Date().toISOString() };
    }
    return await apiRequest(`/projects/${projectId}/images`, {
      method: "POST",
      body: JSON.stringify(imageData),
    });
  },

  /**
   * Galeri Görselini Siler
   * Backend: DELETE /api/projectimages/{id}
   */
  deleteProjectImage: async (imageId) => {
    if (USE_MOCK_DATA) {
      return { success: true, message: "Görsel silindi." };
    }
    return await apiRequest(`/projectimages/${imageId}`, { method: "DELETE" });
  },

  /**
   * Projeyi Siler
   * Backend: DELETE /api/projects/{id}
   */
  deleteProject: async (id) => {
    if (USE_MOCK_DATA) {
      mockProjects = mockProjects.filter((p) => p.id !== Number(id));
      return { success: true, message: "Proje başarıyla silindi." };
    }
    return await apiRequest(`/projects/${id}`, { method: "DELETE" });
  },

  delete: async (id) => projectService.deleteProject(id),
};

export default projectService;

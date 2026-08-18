import { apiRequest, USE_MOCK_DATA } from "./api";

// Initial Mock Projects Data
let mockProjects = [
  { id: 1, title: "FinTech Dashboard", summary: "Gerçek zamanlı finansal analitik platformu.", description: "Gerçek zamanlı finansal analitik platformu. React ve Node.js ile geliştirildi.", category: "Web", tag: "React · Node.js", status: "published", color: "#6366f1", icon: "bi-bar-chart-line", visibility: "Public", boosted: true, author: "Ahmet Yılmaz", client: "FinBank A.Ş.", technologies: ["React", "Node.js", "PostgreSQL"], fileName: "fintech-v1.zip", createdAt: "2026-08-01T10:00:00Z", updatedAt: "2026-08-10T14:00:00Z" },
  { id: 2, title: "MedApp Mobil", summary: "Hasta takip ve randevu yönetimi uygulaması.", description: "iOS ve Android uyumlu hasta takip sistemi.", category: "Mobil", tag: "React Native", status: "published", color: "#38bdf8", icon: "bi-heart-pulse", visibility: "Public", boosted: false, author: "Zeynep Kaya", client: "Sağlık Merkezi", technologies: ["React Native", "Firebase"], fileName: "medapp-release.apk", createdAt: "2026-07-20T09:00:00Z", updatedAt: "2026-08-05T11:00:00Z" },
  { id: 3, title: "AI Chatbot Platformu", summary: "Kurumsal müşteri hizmetleri chatbot altyapısı.", description: "GPT-4 tabanlı kurumsal chatbot çözümü.", category: "Yapay Zekâ", tag: "Python · GPT-4", status: "published", color: "#34d399", icon: "bi-chat-square-dots", visibility: "Private (Pro)", boosted: true, author: "Samet Başkale", client: "TechCorp Ltd.", technologies: ["Python", "GPT-4", "FastAPI"], fileName: "ai-core.py", createdAt: "2026-07-15T08:00:00Z", updatedAt: "2026-08-12T16:00:00Z" },
  { id: 4, title: "E-Ticaret Sistemi", summary: "Çok satıcılı marketplace platformu.", description: "Next.js ve Stripe ile geliştirilmiş e-ticaret platformu.", category: "Web", tag: "Next.js · Stripe", status: "draft", color: "#f59e0b", icon: "bi-cart3", visibility: "Public", boosted: false, author: "Caner Demir", client: "MarketTR", technologies: ["Next.js", "Stripe", "MongoDB"], fileName: "shop-bundle.zip", createdAt: "2026-08-08T12:00:00Z", updatedAt: "2026-08-08T12:00:00Z" },
];

export const projectService = {
  // GET ALL PROJECTS — admin ve site sayfalarında kullanılır
  getAll: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 300));
      return [...mockProjects];
    }
    return await apiRequest("/projects");
  },

  // Alias — DashboardPage Promise.resolve(projectService.getAll()) uyumluluğu için
  getAllProjects: async () => {
    if (USE_MOCK_DATA) {
      return [...mockProjects];
    }
    return await apiRequest("/projects");
  },

  // CREATE PROJECT (WITH FILE ATTACHMENT)
  createProject: async (projectData) => {
    if (USE_MOCK_DATA) {
      const newProject = {
        id: Date.now(),
        color: "#6366f1",
        icon: "bi-folder-check",
        boosted: false,
        author: projectData.author || "Kullanıcı",
        ...projectData,
      };
      mockProjects = [newProject, ...mockProjects];
      return newProject;
    }
    return await apiRequest("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  },

  // UPDATE PROJECT
  updateProject: async (id, updatedFields) => {
    if (USE_MOCK_DATA) {
      mockProjects = mockProjects.map((p) =>
        p.id === Number(id) ? { ...p, ...updatedFields } : p
      );
      return mockProjects.find((p) => p.id === Number(id));
    }
    return await apiRequest(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedFields),
    });
  },

  // DELETE PROJECT
  deleteProject: async (id) => {
    if (USE_MOCK_DATA) {
      mockProjects = mockProjects.filter((p) => p.id !== Number(id));
      return { success: true, message: "Proje başarıyla silindi." };
    }
    return await apiRequest(`/projects/${id}`, {
      method: "DELETE",
    });
  },

  // TOGGLE BOOST STATUS
  boostProject: async (id, days) => {
    if (USE_MOCK_DATA) {
      mockProjects = mockProjects.map((p) =>
        p.id === Number(id) ? { ...p, boosted: true } : p
      );
      return { success: true, message: `Projeniz ${days} gün boyunca öne çıkarıldı!` };
    }
    return await apiRequest(`/projects/${id}/boost`, {
      method: "POST",
      body: JSON.stringify({ days }),
    });
  },

  // GET BY ID
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      const found = mockProjects.find((p) => p.id === Number(id));
      if (!found) throw new Error("Proje bulunamadı.");
      return found;
    }
    return await apiRequest(`/projects/${id}`);
  },

  // Aliases for standard CRUD naming
  create: async (data) => projectService.createProject(data),
  update: async (id, data) => projectService.updateProject(id, data),
  delete: async (id) => projectService.deleteProject(id),
};

export default projectService;

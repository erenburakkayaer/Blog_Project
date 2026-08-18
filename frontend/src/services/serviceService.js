import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — CompanyService Service
 * Mehdi'nin Branch'i (DTO/CompanyService/) ile %100 senkronize
 * 
 * Model:
 * - id: int
 * - companyId: int
 * - companyName: string
 * - title: string
 * - shortDescription: string
 * - detailedDescription: string
 * - categoryId: int
 * - categoryName: string
 * - isActive: bool
 * - isFeatured: bool
 * - createdAt: DateTime
 */

let mockServices = [
  {
    id: 1,
    companyId: 1,
    companyName: "TechNova Yazılım",
    title: "Özel Web & SaaS Yazılım Geliştirme",
    shortDescription: "Kurumunuza özel, yüksek performanslı ve ölçeklenebilir bulut tabanlı web uygulamaları.",
    detailedDescription: "React 19, .NET 10 ve mikroservis mimarileri ile sıfırdan kurumsal SaaS platformları, e-ticaret portalları ve ERP sistemleri tasarlıyor ve geliştiriyoruz.",
    categoryId: 1,
    categoryName: "Web & SaaS",
    icon: "bi-code-slash",
    features: ["Mikroservis Mimarisi", "Yüksek Güvenlik & 256-bit SSL", "Gerçek Zamanlı Analitik", "Özelleştirilebilir Dashboard"],
    isActive: true,
    isFeatured: true,
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: 2,
    companyId: 1,
    companyName: "TechNova Yazılım",
    title: "Mobil Uygulama Geliştirme (iOS & Android)",
    shortDescription: "Native performansında, kullanıcı deneyimi odaklı modern mobil uygulamalar.",
    detailedDescription: "React Native ve Flutter teknolojileriyle iOS ve Android cihazlar için optimize edilmiş, push bildirimleri ve offline çalışma desteği olan mobil çözümler.",
    categoryId: 2,
    categoryName: "Mobil",
    icon: "bi-phone",
    features: ["Çift Platform (iOS & Android)", "Offline Veri Depolama", "Biyometrik Giriş (Face ID)", "Push Bildirim Entegrasyonu"],
    isActive: true,
    isFeatured: true,
    createdAt: "2026-02-01T11:00:00Z",
  },
  {
    id: 3,
    companyId: 1,
    companyName: "TechNova Yazılım",
    title: "Yapay Zekâ ve LLM Çözümleri",
    shortDescription: "İş süreçlerinizi otomatize eden kurumsal AI, chatbot ve veri analitiği altyapıları.",
    detailedDescription: "OpenAI GPT-4o, Claude ve lokal açık kaynak LLM modellerini şirketinizin dokümanlarıyla besleyerek (RAG) akıllı kurumsal asistanlar geliştiriyoruz.",
    categoryId: 3,
    categoryName: "Yapay Zekâ",
    icon: "bi-cpu",
    features: ["RAG Doküman Arama", "7/24 Akıllı Müşteri Temsilcisi", "Veri Analizi & Tahminleme", "Otomatik Raporlama"],
    isActive: true,
    isFeatured: true,
    createdAt: "2026-03-01T09:00:00Z",
  },
  {
    id: 4,
    companyId: 1,
    companyName: "TechNova Yazılım",
    title: "Siber Güvenlik & Sızma Testleri",
    shortDescription: "Sistemlerinizi yeni nesil siber tehditlere karşı koruyan denetim ve savunma hizmetleri.",
    detailedDescription: "Zero-trust güvenlik mimarisi kurulumu, OWASP standartlarında penetrasyon testleri ve kurumsal güvenlik eğitimleri sunuyoruz.",
    categoryId: 4,
    categoryName: "Güvenlik",
    icon: "bi-shield-check",
    features: ["Sızma (Penetrasyon) Testi", "Zafiyet Taraması", "KVKK & ISO 27001 Uyumluluk", "Güvenlik Duvarı Yapılandırması"],
    isActive: true,
    isFeatured: false,
    createdAt: "2026-04-01T14:00:00Z",
  },
];

export const serviceService = {
  /**
   * Aktif Hizmetleri Listeler (Ziyaretçiye Açık)
   * Backend: GET /api/companyservices
   */
  getActive: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 150));
      return mockServices.filter((s) => s.isActive);
    }
    return await apiRequest("/companyservices");
  },

  /**
   * Tüm Hizmetleri Listeler (Admin)
   * Backend: GET /api/companyservices/all
   */
  getAll: async () => {
    if (USE_MOCK_DATA) {
      return [...mockServices];
    }
    return await apiRequest("/companyservices/all");
  },

  /**
   * ID'ye Göre Hizmet Detayı
   * Backend: GET /api/companyservices/{id}
   */
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      const found = mockServices.find((s) => s.id === Number(id));
      if (!found) throw new Error("Hizmet bulunamadı.");
      return found;
    }
    return await apiRequest(`/companyservices/${id}`);
  },

  /**
   * Yeni Hizmet Ekler
   * Backend: POST /api/companyservices (CompanyServiceCreateDto)
   */
  create: async (data) => {
    if (USE_MOCK_DATA) {
      const newService = {
        id: Date.now(),
        companyId: data.companyId || 1,
        companyName: "TechNova Yazılım",
        title: data.title,
        shortDescription: data.shortDescription || data.summary || "",
        detailedDescription: data.detailedDescription || data.description || "",
        categoryId: Number(data.categoryId) || 1,
        categoryName: data.categoryName || "Genel",
        icon: data.icon || "bi-grid",
        features: data.features || ["Yüksek Performans", "7/24 Destek"],
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        createdAt: new Date().toISOString(),
      };
      mockServices = [...mockServices, newService];
      return newService;
    }
    return await apiRequest("/companyservices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Hizmeti Günceller
   * Backend: PUT /api/companyservices/{id} (CompanyServiceUpdateDto)
   */
  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      mockServices = mockServices.map((s) => (s.id === Number(id) ? { ...s, ...data } : s));
      return mockServices.find((s) => s.id === Number(id));
    }
    return await apiRequest(`/companyservices/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Hizmeti Siler
   * Backend: DELETE /api/companyservices/{id}
   */
  delete: async (id) => {
    if (USE_MOCK_DATA) {
      mockServices = mockServices.filter((s) => s.id !== Number(id));
      return { success: true };
    }
    return await apiRequest(`/companyservices/${id}`, { method: "DELETE" });
  },
};

export default serviceService;

// src/services/serviceService.js
// Hizmet Yönetimi için API Servisi

import { getStoredData, setStoredData } from "../utils/storage";

const INITIAL_SERVICES = [
  {
    id: "1",
    title: "Web Geliştirme",
    slug: "web-gelistirme",
    description:
      "Modern, hızlı ve SEO uyumlu kurumsal web siteleri ve web tabanlı yazılımlar.",
    icon: "bi-code-slash",
    status: "active",
    createdAt: "2026-07-01T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Mobil Uygulama",
    slug: "mobil-uygulama",
    description:
      "iOS ve Android platformları için yüksek performanslı native ve cross-platform mobil uygulamalar.",
    icon: "bi-phone",
    status: "active",
    createdAt: "2026-07-05T11:30:00.000Z",
  },
  {
    id: "3",
    title: "Siber Güvenlik Danışmanlığı",
    slug: "siber-guvenlik-danismanligi",
    description:
      "Zafiyet analizleri, sızma testleri ve kurumsal altyapı güvenlik sertifikasyon süreçleri.",
    icon: "bi-shield-lock",
    status: "active",
    createdAt: "2026-07-10T09:15:00.000Z",
  },
];

export const serviceService = {
  // Tüm hizmetleri getir
  getAll: async () => {
    const services = getStoredData("technova_services", INITIAL_SERVICES);
    return { data: services };
  },

  // ID'ye göre hizmet getir
  getById: async (id) => {
    const services = getStoredData("technova_services", INITIAL_SERVICES);
    const service = services.find((s) => String(s.id) === String(id));
    if (!service) throw new Error("Hizmet bulunamadı.");
    return { data: service };
  },

  // Yeni hizmet oluştur
  create: async (serviceData) => {
    let services = getStoredData("technova_services", INITIAL_SERVICES);
    const newService = {
      id: Date.now().toString(),
      ...serviceData,
      slug: serviceData.title
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
      createdAt: new Date().toISOString(),
    };
    services = [newService, ...services];
    setStoredData("technova_services", services);
    return { data: newService };
  },

  // Hizmeti güncelle
  update: async (id, serviceData) => {
    let services = getStoredData("technova_services", INITIAL_SERVICES);
    let updatedService = null;
    services = services.map((s) => {
      if (String(s.id) === String(id)) {
        updatedService = {
          ...s,
          ...serviceData,
          slug: serviceData.title
            ? serviceData.title
                .toLowerCase()
                .replace(/ğ/g, "g")
                .replace(/ü/g, "u")
                .replace(/ş/g, "s")
                .replace(/ı/g, "i")
                .replace(/ö/g, "o")
                .replace(/ç/g, "c")
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "")
            : s.slug,
        };
        return updatedService;
      }
      return s;
    });
    setStoredData("technova_services", services);
    return { data: updatedService };
  },

  // Hizmeti sil
  delete: async (id) => {
    let services = getStoredData("technova_services", INITIAL_SERVICES);
    services = services.filter((s) => String(s.id) !== String(id));
    setStoredData("technova_services", services);
    return { success: true };
  },
};

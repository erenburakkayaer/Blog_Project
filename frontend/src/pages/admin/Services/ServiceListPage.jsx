// src/pages/admin/Services/ServiceListPage.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { serviceService } from "../../../services/serviceService";
import PageHeader from "../../../components/ui/PageHeader";
import SearchInput from "../../../components/ui/SearchInput";
import FilterSelect from "../../../components/ui/FilterSelect";
import StatusBadge from "../../../components/ui/StatusBadge";
import LoadingState from "../../../components/ui/LoadingState";

const ITEMS_PER_PAGE = 4;

const INITIAL_SERVICES = [
  {
    id: "1",
    title: "Web Geliştirme",
    description:
      "Modern, hızlı ve SEO uyumlu kurumsal web siteleri ve web tabanlı yazılımlar.",
    icon: "bi-code-slash",
    status: "active",
  },
  {
    id: "2",
    title: "Mobil Uygulama",
    description:
      "iOS ve Android platformları için yüksek performanslı native ve cross-platform uygulamalar.",
    icon: "bi-phone",
    status: "active",
  },
  {
    id: "3",
    title: "Siber Güvenlik Danışmanlığı",
    description:
      "Zafiyet analizleri, sızma testleri ve kurumsal altyapı güvenlik sertifikasyonları.",
    icon: "bi-shield-lock",
    status: "active",
  },
  {
    id: "4",
    title: "Yapay Zekâ ve Makine Öğrenmesi",
    description:
      "İş süreçlerinizi optimize etmek için özel yapay zekâ modelleri, doğal dil işleme sistemleri.",
    icon: "bi-cpu",
    status: "active",
  },
  {
    id: "5",
    title: "Bulut Altyapı Yönetimi",
    description:
      "AWS, Google Cloud ve Azure platformlarında güvenli, ölçeklenebilir bulut mimarileri.",
    icon: "bi-cloud-check",
    status: "passive",
  },
];

export default function ServiceListPage() {
  const [services, setServices] = useState(() => {
    try {
      const res = serviceService.getAll();
      const data = Array.isArray(res?.data) ? res.data : res;
      return Array.isArray(data) && data.length > 0 ? data : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modal State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "bi-gear",
    status: "active",
  });

  const filteredServices = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return services.filter((service) => {
      const matchesSearch =
        !term ||
        service.title?.toLowerCase().includes(term) ||
        service.description?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || service.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredServices.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedServices = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredServices.slice(startIndex, endIndex);
  }, [filteredServices, safeCurrentPage]);

  const handleOpenCreate = () => {
    setSelectedService(null);
    setFormData({
      title: "",
      description: "",
      icon: "bi-gear",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setSelectedService(service);
    setFormData({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "bi-gear",
      status: service.status || "active",
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Hizmet adı boş olamaz.");
      return;
    }

    if (selectedService) {
      // Güncelleme
      setServices((prev) =>
        prev.map((s) =>
          s.id === selectedService.id ? { ...s, ...formData } : s,
        ),
      );
      toast.success("Hizmet başarıyla güncellendi.");
    } else {
      // Yeni Ekleme
      const newService = {
        id: Date.now().toString(),
        ...formData,
      };
      setServices((prev) => [newService, ...prev]);
      toast.success("Yeni hizmet başarıyla eklendi.");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
    toast.success("Hizmet başarıyla silindi.");
  };

  return (
    <div className="container-fluid px-4 py-4">
      <PageHeader
        title="Hizmet Yönetimi"
        description="Web sitenizde sunulan hizmet içeriklerini buradan yönetebilirsiniz."
        actionLabel="Yeni Hizmet Ekle"
        onAction={handleOpenCreate}
      />

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <SearchInput
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Hizmet adı veya açıklamada ara..."
          />
        </div>
        <div className="col-md-4">
          <FilterSelect
            id="service-status-filter"
            label="Durum Filtresi"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: "active", label: "Aktif" },
              { value: "passive", label: "Pasif" },
            ]}
          />
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <LoadingState />
          ) : paginatedServices.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-gear display-4 mb-3 d-block text-secondary" />
              <p className="mb-0">Kriterlere uygun hizmet bulunamadı.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">
                      Hizmet Adı
                    </th>
                    <th scope="col">Açıklama</th>
                    <th scope="col">İkon</th>
                    <th scope="col">Durum</th>
                    <th scope="col" className="text-end pe-4">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedServices.map((service) => (
                    <tr key={service.id}>
                      <td className="ps-4 fw-semibold text-dark">
                        <button
                          type="button"
                          className="btn btn-link text-decoration-none p-0 text-start d-flex align-items-center gap-2 text-dark fw-bold"
                          onClick={() => handleOpenEdit(service)}
                          title="Hizmet detayını görüntüle ve düzenle"
                        >
                          <span
                            className="rounded bg-light border p-2 text-primary d-flex align-items-center justify-content-center"
                            style={{ width: "38px", height: "38px" }}
                          >
                            <i className={`bi ${service.icon || "bi-gear"}`} />
                          </span>
                          <span>{service.title}</span>
                        </button>
                      </td>
                      <td
                        className="text-secondary text-truncate"
                        style={{ maxWidth: "300px" }}
                      >
                        {service.description}
                      </td>
                      <td>
                        <code className="text-danger">{service.icon}</code>
                      </td>
                      <td>
                        <StatusBadge status={service.status} />
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleOpenEdit(service)}
                            title="Düzenle"
                          >
                            <i className="bi bi-pencil" />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(service.id)}
                            title="Sil"
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <span className="text-secondary small">
            Sayfa {safeCurrentPage} / {totalPages} (Toplam{" "}
            {filteredServices.length} hizmet)
          </span>

          <nav aria-label="Hizmet sayfalama">
            <ul className="pagination pagination-sm mb-0">
              <li
                className={`page-item ${safeCurrentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  type="button"
                  className="page-link"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Önceki
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <li
                    key={pageNumber}
                    className={`page-item ${safeCurrentPage === pageNumber ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ),
              )}

              <li
                className={`page-item ${safeCurrentPage === totalPages ? "disabled" : ""}`}
              >
                <button
                  type="button"
                  className="page-link"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                >
                  Sonraki
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Hizmet Ekleme / Düzenleme Modalı */}
      {isModalOpen && (
        <div
          className="modal show fade d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-light px-4 py-3">
                <h5 className="modal-title fw-bold text-dark">
                  {selectedService ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                />
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-medium">Hizmet Adı</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Örn: Web Geliştirme"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Açıklama</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Hizmet detayları ve açıklaması..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Bootstrap İkon Sınıfı
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Örn: bi-code-slash"
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Durum</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="active">Aktif</option>
                      <option value="passive">Pasif</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Vazgeç
                  </button>
                  <button type="submit" className="btn btn-dark px-4">
                    {selectedService
                      ? "Değişiklikleri Kaydet"
                      : "Hizmeti Oluştur"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

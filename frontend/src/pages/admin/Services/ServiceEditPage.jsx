// src/pages/admin/Services/ServiceEditPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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

export default function ServiceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "bi-gear",
    status: "active",
  });

  useEffect(() => {
    // LocalStorage veya mock verilerden ilgili ID'ye sahip hizmeti buluyoruz
    const stored =
      JSON.parse(localStorage.getItem("technova_services")) || INITIAL_SERVICES;
    const service = stored.find((s) => String(s.id) === String(id));

    if (service) {
      setFormData(service);
    } else {
      toast.error("Hizmet bulunamadı.");
      navigate("/admin/hizmetler");
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const stored =
      JSON.parse(localStorage.getItem("technova_services")) || INITIAL_SERVICES;
    const updated = stored.map((s) =>
      String(s.id) === String(id) ? { ...s, ...formData } : s,
    );

    localStorage.setItem("technova_services", JSON.stringify(updated));
    toast.success("Hizmet başarıyla güncellendi.");
    navigate("/admin/hizmetler");
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">Hizmet Detayı ve Düzenleme</h1>
          <p className="text-secondary mb-0">
            "{formData.title}" hizmetine ait bilgileri güncelleyin.
          </p>
        </div>
        <Link
          to="/admin/hizmetler"
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
        >
          <i className="bi bi-arrow-left" />
          <span>Hizmetlere Dön</span>
        </Link>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium">Hizmet Adı</label>
              <input
                type="text"
                className="form-control"
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
                rows="4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
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
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              />
            </div>

            <div className="mb-4">
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

            <div className="d-flex justify-content-end gap-2">
              <Link
                to="/admin/hizmetler"
                className="btn btn-outline-secondary px-4"
              >
                İptal
              </Link>
              <button type="submit" className="btn btn-dark px-4">
                Değişiklikleri Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// src/pages/admin/Services/ServiceModal.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function ServiceModal({ isOpen, service, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "bi-gear",
    status: "active",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        description: service.description || "",
        icon: service.icon || "bi-gear",
        status: service.status || "active",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        icon: "bi-gear",
        status: "active",
      });
    }
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show fade d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-light px-4 py-3">
            <h5 className="modal-title fw-bold text-dark">
              {service ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            />
          </div>

          <form onSubmit={handleSubmit}>
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
                  placeholder="Hizmet hakkında kısa açıklama..."
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
                  placeholder="Örn: bi-code-slash"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                />
                <div className="form-text">
                  Bootstrap Icons sınıflarını kullanabilirsiniz.
                </div>
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
                onClick={onClose}
                disabled={loading}
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="btn btn-dark px-4"
                disabled={loading}
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

ServiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  service: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

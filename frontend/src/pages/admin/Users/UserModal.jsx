// src/pages/admin/Users/UserModal.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function UserModal({ isOpen, user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "author",
    status: "active",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "author",
        status: user.status || "active",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "author",
        status: "active",
      });
    }
  }, [user, isOpen]);

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
              {user ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}
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
                <label className="form-label fw-medium">Ad Soyad</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Örn: Ahmet Yılmaz"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">E-posta Adresi</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="ornek@technova.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Rol</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="admin">Yönetici</option>
                  <option value="editor">Editör</option>
                  <option value="author">Yazar</option>
                </select>
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

UserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  user: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

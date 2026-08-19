import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { USER_ROLES } from "../../../services/userService";

export default function UserModal({ isOpen, user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    jobTitle: "",
    role: "author",
    status: "active",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.fullName || "",
        username: user.username || user.userName || user.email?.split("@")[0] || "",
        email: user.email || "",
        password: "",
        jobTitle: user.jobTitle || "",
        role: user.role || "author",
        status: user.status || "active",
      });
    } else {
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        jobTitle: "",
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
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light px-4 py-3 border-bottom">
            <h5 className="modal-title fw-bold text-dark fs-6">
              <i className="bi bi-person-gear me-2 text-primary" />
              {user ? "Kullanıcı Rolü & Bilgilerini Düzenle" : "Yeni Kullanıcı ve Rol Tanımla"}
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
                <label className="form-label fw-semibold small text-secondary">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="Örn: Ahmet Yılmaz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Kullanıcı Adı
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-secondary">@</span>
                    <input
                      type="text"
                      className="form-control rounded-end-3"
                      placeholder="ahmety"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    E-Posta Adresi
                  </label>
                  <input
                    type="email"
                    className="form-control rounded-3"
                    placeholder="ahmet@technova.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  {user ? "Yeni Şifre (Boş bırakılırsa değişmez)" : "Giriş Şifresi"}
                </label>
                <input
                  type="password"
                  className="form-control rounded-3"
                  placeholder={user ? "••••••••" : "En az 6 karakterli şifre"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!user}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  Mesleki Unvan / Pozisyon
                </label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="Örn: Senior Frontend Developer / İK Müdürü"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  Kullanıcı Rolü & Yetki Düzeyi
                </label>
                <select
                  className="form-select rounded-3 py-2 fw-semibold"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  {USER_ROLES.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.badge} — {r.label}
                    </option>
                  ))}
                </select>
                <div className="form-text small" style={{ fontSize: "11px" }}>
                  Seçilen role göre kullanıcının yönetim panelinde göreceği menüler ve yetkiler değişir.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  Hesap Durumu
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="statusActive"
                      value="active"
                      checked={formData.status === "active"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                    <label className="form-check-label small" htmlFor="statusActive">
                      🟢 Aktif
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="status"
                      id="statusPassive"
                      value="passive"
                      checked={formData.status === "passive"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    />
                    <label className="form-check-label small" htmlFor="statusPassive">
                      ⚪ Pasif
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light px-4 py-3 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={onClose}
                disabled={loading}
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm"
                disabled={loading}
              >
                {loading ? "Kaydediliyor..." : user ? "Güncelle" : "Kullanıcıyı Kaydet"}
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

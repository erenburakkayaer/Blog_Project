// src/components/admin/AdminHeader.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

function AdminHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState({
    username: user?.fullName || "Yönetici",
    adminEmail: user?.email || "admin@technova.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
  });

  useEffect(() => {
    const loadHeaderProfile = () => {
      const saved = localStorage.getItem("technova_admin_profile");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile({
            username: parsed.username || parsed.fullName || user?.fullName || "Yönetici",
            adminEmail: parsed.adminEmail || parsed.email || user?.email || "admin@technova.com",
            avatar: parsed.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
          });
        } catch (e) {
          console.error(e);
        }
      }
    };

    loadHeaderProfile();
    window.addEventListener("storage", loadHeaderProfile);
    window.addEventListener("adminProfileUpdated", loadHeaderProfile);

    return () => {
      window.removeEventListener("storage", loadHeaderProfile);
      window.removeEventListener("adminProfileUpdated", loadHeaderProfile);
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    toast.success("Oturum kapatıldı.");
    navigate("/giris", { replace: true });
  };

  return (
    <header className="admin-header d-flex justify-content-between align-items-center bg-white border-bottom px-4 py-3 sticky-top">
      <div>
        <div className="d-flex align-items-center gap-2">
          <h1 className="h5 mb-0 fw-bold text-dark">Yönetim Paneli</h1>
          <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill small fw-semibold">
            TechNova v2.0
          </span>
        </div>
        <p className="text-secondary mb-0 small" style={{ fontSize: "12px" }}>
          Hoş geldiniz, <span className="fw-semibold text-dark">{profile.username}</span>
        </p>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Quick Action: New Blog / Project */}
        <Link
          to="/admin/blog/yeni"
          className="btn btn-outline-primary btn-sm rounded-pill d-none d-md-inline-flex align-items-center gap-1 px-3"
        >
          <i className="bi bi-pencil-square" /> Yeni Blog
        </Link>

        <Link
          to="/admin/projeler/yeni"
          className="btn btn-primary btn-sm rounded-pill d-none d-md-inline-flex align-items-center gap-1 px-3 shadow-sm"
        >
          <i className="bi bi-plus-lg" /> Yeni Proje
        </Link>

        {/* User Dropdown */}
        <div className="dropdown">
          <button
            className="btn d-flex align-items-center gap-2 border rounded-pill px-3 py-1 shadow-sm bg-light dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src={profile.avatar}
              alt={profile.username}
              className="rounded-circle object-fit-cover shadow-sm border"
              style={{ width: "32px", height: "32px" }}
            />
            <span className="fw-semibold text-dark small d-none d-sm-inline">
              {profile.username}
            </span>
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2 mt-2 rounded-4"
            style={{ minWidth: "250px" }}
          >
            <li className="px-3 py-2 border-bottom mb-1">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="rounded-circle object-fit-cover shadow-sm border"
                  style={{ width: "42px", height: "42px" }}
                />
                <div className="overflow-hidden">
                  <h6 className="mb-0 fw-bold text-dark text-truncate">
                    {profile.username}
                  </h6>
                  <small className="text-muted text-truncate d-block" style={{ fontSize: "11px" }}>
                    {profile.adminEmail}
                  </small>
                </div>
              </div>
            </li>

            <li>
              <Link
                className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 text-dark fw-medium"
                to="/admin/profil"
              >
                <i className="bi bi-person-badge text-primary fs-5" /> Profilim & Biyografi
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 text-dark fw-medium"
                to="/admin/ayarlar"
              >
                <i className="bi bi-sliders text-secondary fs-5" /> Sistem Ayarları
              </Link>
            </li>

            <li>
              <hr className="dropdown-divider my-2" />
            </li>

            <li>
              <button
                className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 text-danger fw-medium"
                type="button"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right fs-5" /> Çıkış Yap
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;

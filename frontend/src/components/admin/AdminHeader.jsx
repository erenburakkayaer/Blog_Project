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
    adminEmail: "admin@technova.com",
    avatar: "",
  });

  useEffect(() => {
    const loadHeaderProfile = () => {
      const saved = localStorage.getItem("technova_admin_profile");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile({
            username: parsed.username || user?.fullName || "Yönetici",
            adminEmail: parsed.adminEmail || "admin@technova.com",
            avatar: parsed.avatar || "",
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
    <header className="admin-header d-flex justify-content-between align-items-center bg-white border-bottom px-4 py-3">
      <div>
        <h1 className="h4 mb-1 fw-bold text-dark">Yönetim Paneli</h1>
        <p className="text-secondary mb-0 small">
          Hoş geldiniz,{" "}
          <span className="fw-semibold text-dark">{profile.username}</span>
        </p>
      </div>

      <div className="dropdown">
        <button
          className="btn d-flex align-items-center gap-2 border rounded-pill px-3 py-1 shadow-sm bg-light dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.username}
              className="rounded-circle object-fit-cover shadow-sm border"
              style={{ width: "32px", height: "32px" }}
            />
          ) : (
            <div
              className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold fs-6"
              style={{ width: "32px", height: "32px" }}
            >
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="fw-semibold text-dark small">
            {profile.username}
          </span>
        </button>

        <ul
          className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2 mt-2 rounded-4"
          style={{ minWidth: "240px" }}
        >
          <li className="px-3 py-2 border-bottom mb-1">
            <div className="d-flex align-items-center gap-3">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="rounded-circle object-fit-cover shadow-sm border"
                  style={{ width: "42px", height: "42px" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold fs-5"
                  style={{ width: "42px", height: "42px" }}
                >
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <h6 className="mb-0 fw-bold text-dark text-truncate">
                  {profile.username}
                </h6>
                <small
                  className="text-muted text-truncate d-block"
                  style={{ fontSize: "12px" }}
                >
                  {profile.adminEmail}
                </small>
              </div>
            </div>
          </li>

          <li>
            <Link
              className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 text-dark fw-medium"
              to="/admin/ayarlar"
            >
              <i className="bi bi-person-gear text-secondary fs-5" /> Profil ve
              Ayarlar
            </Link>
          </li>
          <li>
            <Link
              className="dropdown-item py-2 px-3 d-flex align-items-center gap-2 text-dark fw-medium"
              to="/admin/ayarlar"
            >
              <i className="bi bi-shield-lock text-secondary fs-5" /> Güvenlik &
              Şifre
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
    </header>
  );
}

export default AdminHeader;

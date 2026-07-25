import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

function AdminHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Oturum kapatıldı.");
    navigate("/giris", { replace: true });
  };

  return (
    <header className="admin-header">
      <div>
        <h1 className="h4 mb-1">Yönetim Paneli</h1>
        <p className="text-secondary mb-0">
          Hoş geldiniz, {user?.fullName || "Yönetici"}
        </p>
      </div>

      <div className="dropdown">
        <button
          className="btn btn-light border dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-person-circle me-2" />
          {user?.fullName || "Yönetici"}
        </button>

        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <button className="dropdown-item" type="button">
              <i className="bi bi-person me-2" />
              Profil
            </button>
          </li>

          <li>
            <hr className="dropdown-divider" />
          </li>

          <li>
            <button
              className="dropdown-item text-danger"
              type="button"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2" />
              Çıkış Yap
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default AdminHeader;

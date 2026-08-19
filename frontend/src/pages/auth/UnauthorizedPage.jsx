import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSwitchAccount = async () => {
    await logout();
    navigate("/giris");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 text-center" style={{ maxWidth: "520px" }}>
        <div
          className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center mx-auto mb-4"
          style={{ width: "80px", height: "80px", fontSize: "36px" }}
        >
          <i className="bi bi-shield-lock-fill" />
        </div>

        <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 mb-2 fw-semibold">
          403 — Yetkisiz Erişim
        </span>

        <h1 className="h4 fw-bold text-dark mb-2">Bu Sayfaya Erişim İzniniz Yok</h1>

        <p className="text-secondary small mb-4">
          Şu an <strong>{user?.fullName || user?.email || "Kullanıcı"}</strong> hesabıyla (Rol: <span className="badge text-bg-secondary">{user?.role || "user"}</span>) oturum açtınız. Bu işlem yalnızca yetkili yöneticiler tarafından gerçekleştirilebilir.
        </p>

        <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
          <Link to="/admin" className="btn btn-primary rounded-pill px-4 fw-semibold">
            <i className="bi bi-speedometer2 me-1" /> Paneline Dön
          </Link>
          <button
            type="button"
            onClick={handleSwitchAccount}
            className="btn btn-outline-secondary rounded-pill px-4 fw-semibold"
          >
            <i className="bi bi-arrow-repeat me-1" /> Farklı Hesapla Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
}

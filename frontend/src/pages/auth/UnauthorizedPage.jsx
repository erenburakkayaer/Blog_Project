import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <section
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "var(--color-background)" }}
    >
      <div className="text-center px-4">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
          style={{
            width: 80,
            height: 80,
            background: "#fee2e2",
          }}
        >
          <i className="bi bi-shield-lock text-danger" style={{ fontSize: 36 }} />
        </div>

        <h1 className="display-6 fw-bold mb-2">Erişim Reddedildi</h1>
        <p className="text-secondary mb-4">
          Bu sayfayı görüntüleme yetkiniz bulunmuyor.
        </p>

        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <Link className="btn btn-primary" to="/admin">
            <i className="bi bi-house me-2" />
            Panele Dön
          </Link>
          <Link className="btn btn-outline-secondary" to="/">
            <i className="bi bi-globe me-2" />
            Ana Sayfaya Git
          </Link>
        </div>
      </div>
    </section>
  );
}

UnauthorizedPage.propTypes = {};

export default UnauthorizedPage;

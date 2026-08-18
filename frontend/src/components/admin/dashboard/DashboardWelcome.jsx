import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Günaydın";
  }

  if (currentHour < 18) {
    return "İyi günler";
  }

  return "İyi akşamlar";
};

function DashboardWelcome({
  adminName,
  totalContent,
  publishedContent,
  draftContent,
}) {
  return (
    <section className="dashboard-welcome">
      <div className="dashboard-welcome__content">
        <span className="dashboard-welcome__badge">
          <i className="bi bi-stars" aria-hidden="true" />
          Yönetim Merkezi
        </span>

        <h1 className="dashboard-welcome__title">
          {getGreeting()}, {adminName}
        </h1>

        <p className="dashboard-welcome__description">
          TechNova içeriklerini, projelerini ve yayın durumunu tek bir merkezden
          yönetin.
        </p>

        <div className="dashboard-welcome__actions">
          <Link to="/admin/blog/yeni" className="btn btn-light">
            <i className="bi bi-file-earmark-plus me-2" aria-hidden="true" />
            Yeni Blog
          </Link>

          <Link to="/admin/projeler/yeni" className="btn btn-outline-light">
            <i className="bi bi-folder-plus me-2" aria-hidden="true" />
            Yeni Proje
          </Link>
        </div>
      </div>

      <div className="dashboard-welcome__summary">
        <div className="dashboard-welcome__summary-item">
          <span>Toplam içerik</span>
          <strong>{totalContent}</strong>
        </div>

        <div className="dashboard-welcome__summary-divider" />

        <div className="dashboard-welcome__summary-item">
          <span>Yayında</span>
          <strong>{publishedContent}</strong>
        </div>

        <div className="dashboard-welcome__summary-divider" />

        <div className="dashboard-welcome__summary-item">
          <span>Taslak</span>
          <strong>{draftContent}</strong>
        </div>
      </div>

      <div className="dashboard-welcome__shape dashboard-welcome__shape--one" />
      <div className="dashboard-welcome__shape dashboard-welcome__shape--two" />
    </section>
  );
}

DashboardWelcome.propTypes = {
  adminName: PropTypes.string,
  totalContent: PropTypes.number,
  publishedContent: PropTypes.number,
  draftContent: PropTypes.number,
};

DashboardWelcome.defaultProps = {
  adminName: "Yönetici",
  totalContent: 0,
  publishedContent: 0,
  draftContent: 0,
};

export default DashboardWelcome;

// src/components/ui/PageHeader.jsx
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

export default function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
}) {
  const location = useLocation();
  const isDashboard =
    location.pathname === "/admin" || location.pathname === "/admin/";

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom gap-3">
      <div>
        <h1 className="h3 fw-bold text-dark mb-1">{title}</h1>
        {description && <p className="text-secondary mb-0">{description}</p>}
      </div>

      <div className="d-flex align-items-center gap-2">
        {!isDashboard && (
          <Link
            to="/admin"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          >
            <i className="bi bi-speedometer2" />
            <span>Dashboard'a Dön</span>
          </Link>
        )}

        {actionLabel && onAction && (
          <button
            type="button"
            className="btn btn-dark btn-sm d-flex align-items-center gap-1"
            onClick={onAction}
          >
            <i className="bi bi-plus-lg" />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

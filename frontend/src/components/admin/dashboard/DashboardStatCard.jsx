// src/components/admin/dashboard/DashboardStatCard.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function DashboardStatCard({
  title,
  value,
  icon,
  description,
  descriptionClass,
  trend,
  trendLabel,
  to,
}) {
  const hasTrend = typeof trend === "number";
  const isPositive = hasTrend && trend >= 0;

  const cardContent = (
    <article
      className={`dashboard-stat-card h-100 ${to ? "dashboard-stat-card--clickable" : ""}`}
    >
      <div className="dashboard-stat-card__header">
        <div className="dashboard-stat-card__icon">
          <i className={`bi ${icon}`} aria-hidden="true" />
        </div>

        {hasTrend && (
          <span
            className={`dashboard-stat-card__trend ${
              isPositive
                ? "dashboard-stat-card__trend--positive"
                : "dashboard-stat-card__trend--negative"
            }`}
          >
            <i
              className={`bi ${
                isPositive ? "bi-arrow-up-right" : "bi-arrow-down-right"
              }`}
              aria-hidden="true"
            />
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="dashboard-stat-card__body">
        <p className="dashboard-stat-card__title">{title}</p>

        <h2 className="dashboard-stat-card__value">{value}</h2>

        <div className="dashboard-stat-card__footer">
          <small className={descriptionClass}>{description}</small>

          {trendLabel && <small className="text-secondary">{trendLabel}</small>}
        </div>
      </div>

      <div className="dashboard-stat-card__decoration" aria-hidden="true" />
    </article>
  );

  if (to) {
    return (
      <Link to={to} className="text-decoration-none d-block h-100">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

DashboardStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  descriptionClass: PropTypes.string,
  trend: PropTypes.number,
  trendLabel: PropTypes.string,
  to: PropTypes.string,
};

DashboardStatCard.defaultProps = {
  descriptionClass: "text-secondary",
  trend: undefined,
  trendLabel: "",
  to: undefined,
};

export default DashboardStatCard;

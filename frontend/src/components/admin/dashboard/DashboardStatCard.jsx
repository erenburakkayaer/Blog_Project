import PropTypes from "prop-types";

function DashboardStatCard({
  title,
  value,
  icon,
  description,
  descriptionClass,
  trend,
  trendLabel,
}) {
  const hasTrend = typeof trend === "number";
  const isPositive = hasTrend && trend >= 0;

  return (
    <article className="dashboard-stat-card h-100">
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
}

DashboardStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  descriptionClass: PropTypes.string,
  trend: PropTypes.number,
  trendLabel: PropTypes.string,
};

DashboardStatCard.defaultProps = {
  descriptionClass: "text-secondary",
  trend: undefined,
  trendLabel: "",
};

export default DashboardStatCard;

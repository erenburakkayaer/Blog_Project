import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const activityTypeConfig = {
  blog: {
    icon: "bi-journal-text",
    className: "dashboard-activity__icon--blog",
  },
  project: {
    icon: "bi-folder2-open",
    className: "dashboard-activity__icon--project",
  },
  message: {
    icon: "bi-envelope",
    className: "dashboard-activity__icon--message",
  },
  user: {
    icon: "bi-person",
    className: "dashboard-activity__icon--user",
  },
  system: {
    icon: "bi-gear",
    className: "dashboard-activity__icon--system",
  },
};

const formatActivityDate = (dateValue) => {
  if (!dateValue) {
    return "Tarih bilinmiyor";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Tarih bilinmiyor";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function DashboardActivity({ activities }) {
  return (
    <section className="dashboard-panel h-100">
      <div className="dashboard-panel__header">
        <div>
          <span className="dashboard-panel__eyebrow">Canlı Akış</span>

          <h2 className="h5 fw-bold mb-1">Son Aktiviteler</h2>

          <p className="text-secondary mb-0">
            Yönetim panelindeki son işlemler
          </p>
        </div>

        <span className="dashboard-live-badge">
          <span className="dashboard-live-badge__dot" />
          Canlı
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="dashboard-empty-state">
          <div className="dashboard-empty-state__icon">
            <i className="bi bi-activity" aria-hidden="true" />
          </div>

          <h3 className="h6">Henüz aktivite bulunmuyor</h3>

          <p className="text-secondary mb-0">
            Yeni içerikler oluşturulduğunda burada gösterilecektir.
          </p>
        </div>
      ) : (
        <div className="dashboard-activity">
          {activities.map((activity, index) => {
            const config =
              activityTypeConfig[activity.type] || activityTypeConfig.system;

            const activityContent = (
              <>
                <div className={`dashboard-activity__icon ${config.className}`}>
                  <i className={`bi ${config.icon}`} aria-hidden="true" />
                </div>

                <div className="dashboard-activity__content">
                  <div className="dashboard-activity__top">
                    <h3 className="dashboard-activity__title">
                      {activity.title}
                    </h3>

                    <time
                      className="dashboard-activity__time"
                      dateTime={activity.date}
                    >
                      {formatActivityDate(activity.date)}
                    </time>
                  </div>

                  <p className="dashboard-activity__description">
                    {activity.description}
                  </p>
                </div>
              </>
            );

            return (
              <div className="dashboard-activity__item" key={activity.id}>
                {activity.path ? (
                  <Link to={activity.path} className="dashboard-activity__link">
                    {activityContent}
                  </Link>
                ) : (
                  <div className="dashboard-activity__link">
                    {activityContent}
                  </div>
                )}

                {index < activities.length - 1 && (
                  <span
                    className="dashboard-activity__line"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

DashboardActivity.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["blog", "project", "message", "user", "system"])
        .isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      date: PropTypes.string,
      path: PropTypes.string,
    }),
  ),
};

DashboardActivity.defaultProps = {
  activities: [],
};

export default DashboardActivity;

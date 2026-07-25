import PropTypes from "prop-types";

const STATUS_CONFIG = {
  published: {
    label: "Yayında",
    className: "bg-success-subtle text-success-emphasis",
    icon: "bi-check-circle-fill",
  },
  draft: {
    label: "Taslak",
    className: "bg-warning-subtle text-warning-emphasis",
    icon: "bi-pencil-fill",
  },
  archived: {
    label: "Arşivlendi",
    className: "bg-secondary-subtle text-secondary-emphasis",
    icon: "bi-archive-fill",
  },
  active: {
    label: "Aktif",
    className: "bg-success-subtle text-success-emphasis",
    icon: "bi-check-circle-fill",
  },
  passive: {
    label: "Pasif",
    className: "bg-danger-subtle text-danger-emphasis",
    icon: "bi-x-circle-fill",
  },
  pending: {
    label: "Beklemede",
    className: "bg-info-subtle text-info-emphasis",
    icon: "bi-clock-fill",
  },
  completed: {
    label: "Tamamlandı",
    className: "bg-success-subtle text-success-emphasis",
    icon: "bi-check-circle-fill",
  },
};

const StatusBadge = ({ status, label, showIcon = true }) => {
  const normalizedStatus = String(status || "").toLowerCase();

  const config = STATUS_CONFIG[normalizedStatus] || {
    label: label || status || "Bilinmiyor",
    className: "bg-light text-dark",
    icon: "bi-circle-fill",
  };

  return (
    <span
      className={`badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-2 ${config.className}`}
    >
      {showIcon && (
        <i className={`bi ${config.icon}`} style={{ fontSize: "0.7rem" }} />
      )}

      <span>{label || config.label}</span>
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string,
  label: PropTypes.string,
  showIcon: PropTypes.bool,
};

StatusBadge.defaultProps = {
  status: "",
  label: "",
  showIcon: true,
};

export default StatusBadge;

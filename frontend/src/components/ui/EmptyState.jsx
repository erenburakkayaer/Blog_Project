import PropTypes from "prop-types";

const EmptyState = ({
  icon = "bi-inbox",
  title = "Kayıt bulunamadı",
  description = "Görüntülenecek herhangi bir kayıt bulunmuyor.",
  actionLabel,
  actionIcon = "bi-plus-lg",
  onAction,
}) => {
  return (
    <div className="text-center py-5 px-3">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-3"
        style={{
          width: "72px",
          height: "72px",
        }}
      >
        <i className={`bi ${icon} fs-2 text-secondary`} />
      </div>

      <h2 className="h5 fw-semibold text-dark mb-2">{title}</h2>

      <p className="text-secondary mx-auto mb-4" style={{ maxWidth: "480px" }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          className="btn btn-dark d-inline-flex align-items-center gap-2"
          onClick={onAction}
        >
          <i className={`bi ${actionIcon}`} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  actionIcon: PropTypes.string,
  onAction: PropTypes.func,
};

EmptyState.defaultProps = {
  icon: "bi-inbox",
  title: "Kayıt bulunamadı",
  description: "Görüntülenecek herhangi bir kayıt bulunmuyor.",
  actionLabel: "",
  actionIcon: "bi-plus-lg",
  onAction: null,
};

export default EmptyState;

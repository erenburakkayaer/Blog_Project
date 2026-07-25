import PropTypes from "prop-types";

const PageHeader = ({
  title,
  description,
  actionLabel,
  actionIcon = "bi-plus-lg",
  onAction,
  children,
}) => {
  return (
    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
      <div>
        <h1 className="h3 fw-bold text-dark mb-1">{title}</h1>

        {description && <p className="text-secondary mb-0">{description}</p>}
      </div>

      <div className="d-flex align-items-center gap-2">
        {children}

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
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  actionIcon: PropTypes.string,
  onAction: PropTypes.func,
  children: PropTypes.node,
};

PageHeader.defaultProps = {
  description: "",
  actionLabel: "",
  actionIcon: "bi-plus-lg",
  onAction: null,
  children: null,
};

export default PageHeader;

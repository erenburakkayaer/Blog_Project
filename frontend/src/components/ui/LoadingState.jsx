import PropTypes from "prop-types";

const LoadingState = ({
  text = "Veriler yükleniyor...",
  minHeight = "280px",
}) => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight }}
      role="status"
      aria-live="polite"
    >
      <div className="spinner-border text-dark mb-3" aria-hidden="true" />

      <p className="text-secondary mb-0">{text}</p>
    </div>
  );
};

LoadingState.propTypes = {
  text: PropTypes.string,
  minHeight: PropTypes.string,
};

export default LoadingState;

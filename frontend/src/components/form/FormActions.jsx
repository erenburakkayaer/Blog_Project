import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const FormActions = ({
  cancelTo,
  cancelLabel = "Vazgeç",
  submitLabel = "Kaydet",
  loadingLabel = "Kaydediliyor...",
  submitIcon = "bi-check-lg",
  cancelIcon = "bi-x-lg",
  isSubmitting = false,
  submitVariant = "dark",
  className = "",
}) => {
  return (
    <div
      className={`d-flex flex-column-reverse flex-sm-row justify-content-end gap-2 ${className}`.trim()}
    >
      <Link
        to={cancelTo}
        className={`btn btn-outline-secondary ${
          isSubmitting ? "disabled" : ""
        }`}
        aria-disabled={isSubmitting}
        tabIndex={isSubmitting ? -1 : undefined}
      >
        <i className={`bi ${cancelIcon} me-2`} aria-hidden="true" />

        {cancelLabel}
      </Link>

      <button
        type="submit"
        className={`btn btn-${submitVariant}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            />

            {loadingLabel}
          </>
        ) : (
          <>
            <i className={`bi ${submitIcon} me-2`} aria-hidden="true" />

            {submitLabel}
          </>
        )}
      </button>
    </div>
  );
};

FormActions.propTypes = {
  cancelTo: PropTypes.string.isRequired,
  cancelLabel: PropTypes.string,
  submitLabel: PropTypes.string,
  loadingLabel: PropTypes.string,
  submitIcon: PropTypes.string,
  cancelIcon: PropTypes.string,
  isSubmitting: PropTypes.bool,
  submitVariant: PropTypes.string,
  className: PropTypes.string,
};

export default FormActions;

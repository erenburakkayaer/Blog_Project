import PropTypes from "prop-types";

const FormTextarea = ({
  id,
  label,
  placeholder = "",
  rows = 4,
  required = false,
  error = "",
  helpText = "",
  disabled = false,
  characterCount,
  maxLength,
  className = "",
  textareaClassName = "",
  register,
  ...textareaProps
}) => {
  const hasCharacterCounter = typeof characterCount === "number";

  return (
    <div className={className}>
      <div className="d-flex justify-content-between align-items-center gap-3">
        {label && (
          <label htmlFor={id} className="form-label fw-semibold">
            {label}

            {required && (
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {hasCharacterCounter && (
          <small className="text-muted mb-2 text-nowrap">
            {characterCount}
            {maxLength ? `/${maxLength}` : " karakter"}
          </small>
        )}
      </div>

      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : helpText ? `${id}-help` : undefined
        }
        className={`form-control ${
          error ? "is-invalid" : ""
        } ${textareaClassName}`.trim()}
        {...register}
        {...textareaProps}
      />

      {error && (
        <div id={`${id}-error`} className="invalid-feedback">
          {error}
        </div>
      )}

      {!error && helpText && (
        <div id={`${id}-help`} className="form-text">
          {helpText}
        </div>
      )}
    </div>
  );
};

FormTextarea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  disabled: PropTypes.bool,
  characterCount: PropTypes.number,
  maxLength: PropTypes.number,
  className: PropTypes.string,
  textareaClassName: PropTypes.string,
  register: PropTypes.object,
};

FormTextarea.defaultProps = {
  label: "",
  error: "",
  helpText: "",
  register: {},
};

export default FormTextarea;

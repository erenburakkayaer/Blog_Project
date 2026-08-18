import PropTypes from "prop-types";

const FormInput = ({
  id,
  label,
  type = "text",
  placeholder = "",
  required = false,
  error = "",
  helpText = "",
  disabled = false,
  className = "",
  inputClassName = "",
  register,
  ...inputProps
}) => {
  return (
    <div className={className}>
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

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : helpText ? `${id}-help` : undefined
        }
        className={`form-control ${
          error ? "is-invalid" : ""
        } ${inputClassName}`.trim()}
        {...register}
        {...inputProps}
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

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  register: PropTypes.object,
};

FormInput.defaultProps = {
  label: "",
  error: "",
  helpText: "",
  register: {},
};

export default FormInput;

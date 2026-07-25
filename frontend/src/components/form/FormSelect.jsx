import PropTypes from "prop-types";

const FormSelect = ({
  id,
  label,
  options,
  placeholder = "Seçiniz",
  required = false,
  error = "",
  helpText = "",
  disabled = false,
  className = "",
  selectClassName = "",
  register,
  ...selectProps
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

      <select
        id={id}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : helpText ? `${id}-help` : undefined
        }
        className={`form-select ${
          error ? "is-invalid" : ""
        } ${selectClassName}`.trim()}
        {...register}
        {...selectProps}
      >
        {placeholder !== null && <option value="">{placeholder}</option>}

        {options.map((option) => {
          const normalizedOption =
            typeof option === "string"
              ? {
                  value: option,
                  label: option,
                  disabled: false,
                }
              : option;

          return (
            <option
              key={normalizedOption.value}
              value={normalizedOption.value}
              disabled={Boolean(normalizedOption.disabled)}
            >
              {normalizedOption.label}
            </option>
          );
        })}
      </select>

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

FormSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]).isRequired,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
      }),
    ]),
  ).isRequired,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  required: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  selectClassName: PropTypes.string,
  register: PropTypes.object,
};

FormSelect.defaultProps = {
  label: "",
  placeholder: "Seçiniz",
  error: "",
  helpText: "",
  register: {},
};

export default FormSelect;

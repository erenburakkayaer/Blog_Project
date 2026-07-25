import PropTypes from "prop-types";

const FilterSelect = ({
  id,
  label,
  value,
  options,
  onChange,
  allLabel = "Tümü",
  allValue = "all",
}) => {
  return (
    <div>
      <label htmlFor={id} className="form-label fw-medium">
        {label}
      </label>

      <select
        id={id}
        className="form-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value={allValue}>{allLabel}</option>

        {options.map((option) => {
          const normalizedOption =
            typeof option === "string"
              ? {
                  value: option,
                  label: option,
                }
              : option;

          return (
            <option key={normalizedOption.value} value={normalizedOption.value}>
              {normalizedOption.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

FilterSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ]),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  allLabel: PropTypes.string,
  allValue: PropTypes.string,
};

export default FilterSelect;

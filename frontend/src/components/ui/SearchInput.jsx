import PropTypes from "prop-types";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Ara...",
  label = "Arama",
  icon = "bi-search",
  id = "search-input",
}) => {
  return (
    <div>
      <label htmlFor={id} className="form-label fw-medium">
        {label}
      </label>

      <div className="input-group">
        <span className="input-group-text bg-white">
          <i className={`bi ${icon}`} aria-hidden="true" />
        </span>

        <input
          id={id}
          type="search"
          className="form-control"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  id: PropTypes.string,
};

export default SearchInput;

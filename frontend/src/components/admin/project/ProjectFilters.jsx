import PropTypes from "prop-types";

const ProjectFilters = ({
  searchTerm,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onReset,
}) => {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-5">
            <label htmlFor="project-search" className="form-label">
              Proje Ara
            </label>

            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search" />
              </span>

              <input
                id="project-search"
                type="search"
                className="form-control"
                placeholder="Proje adı, müşteri veya teknoloji ara..."
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-5 col-lg-3">
            <label htmlFor="project-category" className="form-label">
              Kategori
            </label>

            <select
              id="project-category"
              className="form-select"
              value={category}
              onChange={(event) => onCategoryChange(event.target.value)}
            >
              <option value="all">Tüm kategoriler</option>
              <option value="Web">Web</option>
              <option value="Mobil">Mobil</option>
              <option value="Yapay Zekâ">Yapay Zekâ</option>
              <option value="Siber Güvenlik">Siber Güvenlik</option>
            </select>
          </div>

          <div className="col-12 col-md-5 col-lg-2">
            <label htmlFor="project-status" className="form-label">
              Durum
            </label>

            <select
              id="project-status"
              className="form-select"
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option value="all">Tüm durumlar</option>
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
            </select>
          </div>

          <div className="col-12 col-md-2 col-lg-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={onReset}
            >
              <i className="bi bi-arrow-counterclockwise me-2" />
              Temizle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProjectFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default ProjectFilters;

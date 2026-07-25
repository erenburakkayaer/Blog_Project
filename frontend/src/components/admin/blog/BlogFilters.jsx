import { Link } from "react-router-dom";

const BlogFilters = ({
  searchTerm,
  selectedCategory,
  selectedStatus,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
}) => {
  const hasActiveFilters =
    searchTerm || selectedCategory !== "all" || selectedStatus !== "all";

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-xl-4">
            <label htmlFor="blogSearch" className="form-label fw-semibold">
              Blog Ara
            </label>

            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search" />
              </span>

              <input
                id="blogSearch"
                type="search"
                className="form-control"
                placeholder="Blog başlığı veya yazar ara..."
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label htmlFor="blogCategory" className="form-label fw-semibold">
              Kategori
            </label>

            <select
              id="blogCategory"
              className="form-select"
              value={selectedCategory}
              onChange={(event) => onCategoryChange(event.target.value)}
            >
              <option value="all">Tüm kategoriler</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl-2">
            <label htmlFor="blogStatus" className="form-label fw-semibold">
              Durum
            </label>

            <select
              id="blogStatus"
              className="form-select"
              value={selectedStatus}
              onChange={(event) => onStatusChange(event.target.value)}
            >
              <option value="all">Tüm durumlar</option>
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
            </select>
          </div>

          <div className="col-12 col-xl-3">
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-xl-end">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
              >
                <i className="bi bi-arrow-counterclockwise me-2" />
                Temizle
              </button>

              <Link to="/admin/blog/yeni" className="btn btn-dark">
                <i className="bi bi-plus-lg me-2" />
                Yeni Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogFilters;

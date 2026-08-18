import PropTypes from "prop-types";

import { FilterSelect, SearchInput } from "../../ui";

const STATUS_OPTIONS = [
  {
    value: "published",
    label: "Yayında",
  },
  {
    value: "draft",
    label: "Taslak",
  },
];

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
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedStatus !== "all";

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-5">
            <SearchInput
              id="blog-search"
              label="Blog Ara"
              value={searchTerm}
              placeholder="Başlık veya yazar ara..."
              onChange={onSearchChange}
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <FilterSelect
              id="blog-category"
              label="Kategori"
              value={selectedCategory}
              options={categoryOptions}
              allLabel="Tüm kategoriler"
              onChange={onCategoryChange}
            />
          </div>

          <div className="col-12 col-md-6 col-lg-2">
            <FilterSelect
              id="blog-status"
              label="Durum"
              value={selectedStatus}
              options={STATUS_OPTIONS}
              allLabel="Tüm durumlar"
              onChange={onStatusChange}
            />
          </div>

          <div className="col-12 col-lg-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
            >
              <i
                className="bi bi-arrow-counterclockwise me-2"
                aria-hidden="true"
              />
              Temizle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

BlogFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  selectedStatus: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

export default BlogFilters;

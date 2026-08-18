import PropTypes from "prop-types";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  ariaLabel = "Sayfalama",
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages ||
      pageNumber === currentPage
    ) {
      return;
    }

    onPageChange(pageNumber);
  };

  return (
    <nav
      className="d-flex justify-content-center justify-content-md-end mt-4"
      aria-label={ariaLabel}
    >
      <ul className="pagination mb-0">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Önceki sayfa"
          >
            <span className="d-none d-sm-inline">Önceki</span>
            <i className="bi bi-chevron-left d-sm-none" aria-hidden="true" />
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          const isActive = currentPage === pageNumber;

          return (
            <li
              key={pageNumber}
              className={`page-item ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <button
                type="button"
                className="page-link"
                onClick={() => handlePageChange(pageNumber)}
                aria-label={`${pageNumber}. sayfaya git`}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}

        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            type="button"
            className="page-link"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Sonraki sayfa"
          >
            <span className="d-none d-sm-inline">Sonraki</span>
            <i className="bi bi-chevron-right d-sm-none" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
};

export default Pagination;

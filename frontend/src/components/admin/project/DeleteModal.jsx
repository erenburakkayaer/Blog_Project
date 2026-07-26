import PropTypes from "prop-types";

const DeleteModal = ({ project, isDeleting, onClose, onConfirm }) => {
  if (!project) {
    return null;
  }

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h2 id="delete-project-title" className="modal-title fs-5">
                Projeyi Sil
              </h2>

              <button
                type="button"
                className="btn-close"
                aria-label="Kapat"
                disabled={isDeleting}
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <div className="d-flex gap-3">
                <div className="text-danger fs-2">
                  <i className="bi bi-exclamation-triangle-fill" />
                </div>

                <div>
                  <p className="mb-2">
                    <strong>{project.title}</strong> adlı projeyi silmek
                    istediğinize emin misiniz?
                  </p>

                  <p className="text-secondary mb-0">Bu işlem geri alınamaz.</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={isDeleting}
                onClick={onClose}
              >
                Vazgeç
              </button>

              <button
                type="button"
                className="btn btn-danger"
                disabled={isDeleting}
                onClick={onConfirm}
              >
                {isDeleting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    />
                    Siliniyor...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash3 me-2" />
                    Projeyi Sil
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
};

DeleteModal.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  isDeleting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

DeleteModal.defaultProps = {
  project: null,
};

export default DeleteModal;

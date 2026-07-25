import PropTypes from "prop-types";

const ConfirmModal = ({
  isOpen,
  title = "İşlemi onaylıyor musunuz?",
  description = "Bu işlem geri alınamaz.",
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  confirmVariant = "danger",
  icon = "bi-exclamation-triangle-fill",
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onMouseDown={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0 pb-0">
              <button
                type="button"
                className="btn-close"
                aria-label="Kapat"
                onClick={onClose}
                disabled={isLoading}
              />
            </div>

            <div className="modal-body text-center px-4 pb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger mb-3"
                style={{
                  width: "72px",
                  height: "72px",
                }}
              >
                <i className={`bi ${icon} fs-2`} aria-hidden="true" />
              </div>

              <h2
                id="confirm-modal-title"
                className="h5 fw-bold text-dark mb-2"
              >
                {title}
              </h2>

              <p className="text-secondary mb-0">{description}</p>
            </div>

            <div className="modal-footer border-0 justify-content-center pt-0 pb-4">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                className={`btn btn-${confirmVariant} px-4`}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    />
                    İşleniyor...
                  </>
                ) : (
                  confirmLabel
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

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  confirmVariant: PropTypes.string,
  icon: PropTypes.string,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmModal;
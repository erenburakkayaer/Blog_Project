const DeleteModal = ({ blog, isDeleting, onClose, onConfirm }) => {
  if (!blog) {
    return null;
  }

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deleteBlogModalTitle"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h2 id="deleteBlogModalTitle" className="modal-title fs-5">
                Blog Yazısını Sil
              </h2>

              <button
                type="button"
                className="btn-close"
                aria-label="Kapat"
                onClick={onClose}
                disabled={isDeleting}
              />
            </div>

            <div className="modal-body">
              <div className="d-flex gap-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-danger-subtle text-danger"
                  style={{
                    width: "48px",
                    height: "48px",
                  }}
                >
                  <i className="bi bi-trash3 fs-5" />
                </div>

                <div>
                  <p className="mb-2">
                    <strong>{blog.title}</strong> adlı blog yazısını silmek
                    istediğinizden emin misiniz?
                  </p>

                  <p className="text-muted small mb-0">
                    Bu işlem geri alınamaz.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={isDeleting}
              >
                Vazgeç
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={isDeleting}
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
                    Evet, Sil
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

export default DeleteModal;

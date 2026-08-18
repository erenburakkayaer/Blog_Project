import PropTypes from "prop-types";

import { ConfirmModal } from "../../ui";

const DeleteModal = ({ blog, isDeleting, onClose, onConfirm }) => {
  return (
    <ConfirmModal
      isOpen={Boolean(blog)}
      title="Blog yazısı silinsin mi?"
      description={
        blog
          ? `"${blog.title}" başlıklı blog yazısı kalıcı olarak silinecek. Bu işlem geri alınamaz.`
          : ""
      }
      confirmLabel="Blogu Sil"
      cancelLabel="Vazgeç"
      confirmVariant="danger"
      icon="bi-trash3-fill"
      isLoading={isDeleting}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

DeleteModal.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
  }),
  isDeleting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

DeleteModal.defaultProps = {
  blog: null,
};

export default DeleteModal;

import { useRef } from "react";
import PropTypes from "prop-types";

const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ImageUploader = ({
  id = "image-upload",
  label = "Görsel",
  value,
  onChange,
  error,
  helperText = "JPG, PNG veya WEBP formatında görsel seçebilirsiniz.",
  maxSizeMb = 3,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  previewHeight = "220px",
}) => {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!acceptedTypes.includes(file.type)) {
      onChange({
        value: "",
        error: "Yalnızca JPG, PNG veya WEBP formatı yükleyebilirsiniz.",
      });

      event.target.value = "";
      return;
    }

    const maxSizeInBytes = maxSizeMb * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      onChange({
        value: "",
        error: `Görsel boyutu en fazla ${maxSizeMb} MB olabilir.`,
      });

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      onChange({
        value: reader.result,
        file,
        error: "",
      });
    };

    reader.onerror = () => {
      onChange({
        value: "",
        error: "Görsel okunurken bir hata oluştu.",
      });
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onChange({
      value: "",
      file: null,
      error: "",
    });
  };

  return (
    <div>
      <label htmlFor={id} className="form-label fw-medium">
        {label}
      </label>

      {value ? (
        <div className="card border overflow-hidden">
          <img
            src={value}
            alt="Seçilen görsel ön izlemesi"
            className="w-100 object-fit-cover"
            style={{ height: previewHeight }}
          />

          <div className="card-body d-flex flex-column flex-sm-row gap-2">
            <button
              type="button"
              className="btn btn-outline-dark flex-fill"
              onClick={() => inputRef.current?.click()}
            >
              <i className="bi bi-image me-2" aria-hidden="true" />
              Görseli Değiştir
            </button>

            <button
              type="button"
              className="btn btn-outline-danger flex-fill"
              onClick={handleRemove}
            >
              <i className="bi bi-trash me-2" aria-hidden="true" />
              Görseli Kaldır
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`btn w-100 border border-2 border-dashed py-5 ${
            error ? "border-danger" : "border-secondary-subtle"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <div className="d-flex flex-column align-items-center gap-2">
            <i
              className="bi bi-cloud-arrow-up fs-1 text-secondary"
              aria-hidden="true"
            />

            <span className="fw-semibold">Görsel seçmek için tıklayın</span>

            <small className="text-secondary">{helperText}</small>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        className="d-none"
        accept={acceptedTypes.join(",")}
        onChange={handleFileChange}
      />

      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

ImageUploader.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  helperText: PropTypes.string,
  maxSizeMb: PropTypes.number,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
  previewHeight: PropTypes.string,
};

ImageUploader.defaultProps = {
  value: "",
  error: "",
};

export default ImageUploader;

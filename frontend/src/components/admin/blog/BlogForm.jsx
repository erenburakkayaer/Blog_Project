import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

const blogCategories = [
  "Yapay Zekâ",
  "Web",
  "Mobil",
  "Siber Güvenlik",
  "Cloud",
  "DevOps",
  "Veri Bilimi",
  "Yazılım Geliştirme",
];

const isValidCoverImage = (value) => {
  if (!value) {
    return true;
  }

  if (value.startsWith("data:image/")) {
    return true;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const validationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Blog başlığı zorunludur.")
    .min(5, "Blog başlığı en az 5 karakter olmalıdır.")
    .max(150, "Blog başlığı en fazla 150 karakter olabilir."),

  category: yup.string().required("Kategori seçimi zorunludur."),

  author: yup
    .string()
    .trim()
    .required("Yazar adı zorunludur.")
    .min(2, "Yazar adı en az 2 karakter olmalıdır.")
    .max(80, "Yazar adı en fazla 80 karakter olabilir."),

  coverImage: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test(
      "valid-cover-image",
      "Geçerli bir görsel bağlantısı veya görsel dosyası seçiniz.",
      isValidCoverImage,
    ),

  summary: yup
    .string()
    .trim()
    .required("Blog özeti zorunludur.")
    .min(20, "Blog özeti en az 20 karakter olmalıdır.")
    .max(300, "Blog özeti en fazla 300 karakter olabilir."),

  content: yup
    .string()
    .trim()
    .required("Blog içeriği zorunludur.")
    .min(50, "Blog içeriği en az 50 karakter olmalıdır."),

  status: yup
    .string()
    .oneOf(["draft", "published"], "Geçerli bir durum seçiniz.")
    .required("Yayın durumu zorunludur."),
});

const defaultValues = {
  title: "",
  category: "",
  author: "Admin",
  coverImage: "",
  summary: "",
  content: "",
  status: "draft",
};

const BlogForm = ({
  initialValues = defaultValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Kaydet",
}) => {
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [imageLoadError, setImageLoadError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    const initialCoverImage = initialValues?.coverImage || "";

    reset({
      ...defaultValues,
      ...initialValues,
      coverImage: initialCoverImage,
    });

    setImagePreview(initialCoverImage);
    setSelectedFileName("");
    setImageLoadError(false);
  }, [initialValues, reset]);

  const summary = watch("summary") || "";
  const content = watch("content") || "";

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Yalnızca JPG, PNG veya WEBP görsel seçebilirsiniz.");
      event.target.value = "";
      return;
    }

    const maximumFileSize = 2 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      toast.error("Görsel dosyası en fazla 2 MB olabilir.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      if (typeof imageData !== "string") {
        toast.error("Görsel dosyası okunamadı.");
        return;
      }

      setImagePreview(imageData);
      setSelectedFileName(file.name);
      setImageLoadError(false);

      setValue("coverImage", imageData, {
        shouldValidate: true,
        shouldDirty: true,
      });

      clearErrors("coverImage");
      toast.success("Kapak görseli seçildi.");
    };

    reader.onerror = () => {
      toast.error("Görsel dosyası okunurken bir hata oluştu.");
    };

    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (event) => {
    const imageUrl = event.target.value;

    setSelectedFileName("");
    setImagePreview(imageUrl);
    setImageLoadError(false);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setSelectedFileName("");
    setImageLoadError(false);

    setValue("coverImage", "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    const fileInput = document.getElementById("blogCoverImageFile");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h2 className="h5 mb-0">Blog İçeriği</h2>
            </div>

            <div className="card-body">
              <div className="mb-4">
                <label htmlFor="blogTitle" className="form-label fw-semibold">
                  Blog Başlığı
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  id="blogTitle"
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  placeholder="Örneğin: Yapay Zekâ ile İş Süreçlerini Dönüştürme"
                  {...register("title")}
                />

                {errors.title && (
                  <div className="invalid-feedback">{errors.title.message}</div>
                )}
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <label
                    htmlFor="blogSummary"
                    className="form-label fw-semibold"
                  >
                    Kısa Özet
                    <span className="text-danger ms-1">*</span>
                  </label>

                  <small className="text-muted">{summary.length}/300</small>
                </div>

                <textarea
                  id="blogSummary"
                  rows="4"
                  maxLength="300"
                  className={`form-control ${
                    errors.summary ? "is-invalid" : ""
                  }`}
                  placeholder="Blog yazısının kısa açıklamasını giriniz."
                  {...register("summary")}
                />

                {errors.summary && (
                  <div className="invalid-feedback">
                    {errors.summary.message}
                  </div>
                )}
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <label
                    htmlFor="blogContent"
                    className="form-label fw-semibold"
                  >
                    Blog İçeriği
                    <span className="text-danger ms-1">*</span>
                  </label>

                  <small className="text-muted">
                    {content.length} karakter
                  </small>
                </div>

                <textarea
                  id="blogContent"
                  rows="14"
                  className={`form-control ${
                    errors.content ? "is-invalid" : ""
                  }`}
                  placeholder="Blog içeriğini buraya yazınız..."
                  {...register("content")}
                />

                {errors.content && (
                  <div className="invalid-feedback">
                    {errors.content.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h2 className="h5 mb-0">Yayın Ayarları</h2>
            </div>

            <div className="card-body">
              <div className="mb-4">
                <label
                  htmlFor="blogCategory"
                  className="form-label fw-semibold"
                >
                  Kategori
                  <span className="text-danger ms-1">*</span>
                </label>

                <select
                  id="blogCategory"
                  className={`form-select ${
                    errors.category ? "is-invalid" : ""
                  }`}
                  {...register("category")}
                >
                  <option value="">Kategori seçiniz</option>

                  {blogCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {errors.category && (
                  <div className="invalid-feedback">
                    {errors.category.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="blogAuthor" className="form-label fw-semibold">
                  Yazar
                  <span className="text-danger ms-1">*</span>
                </label>

                <input
                  id="blogAuthor"
                  type="text"
                  className={`form-control ${
                    errors.author ? "is-invalid" : ""
                  }`}
                  placeholder="Yazar adı"
                  {...register("author")}
                />

                {errors.author && (
                  <div className="invalid-feedback">
                    {errors.author.message}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="blogStatus" className="form-label fw-semibold">
                  Yayın Durumu
                  <span className="text-danger ms-1">*</span>
                </label>

                <select
                  id="blogStatus"
                  className={`form-select ${errors.status ? "is-invalid" : ""}`}
                  {...register("status")}
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>

                {errors.status && (
                  <div className="invalid-feedback">
                    {errors.status.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h2 className="h5 mb-0">Kapak Görseli</h2>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <label
                  htmlFor="blogCoverImageFile"
                  className="form-label fw-semibold"
                >
                  Bilgisayardan Görsel Seç
                </label>

                <input
                  id="blogCoverImageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="form-control"
                  onChange={handleImageFileChange}
                  disabled={isSubmitting}
                />

                <div className="form-text">
                  JPG, PNG veya WEBP formatı. En fazla 2 MB.
                </div>

                {selectedFileName && (
                  <div className="small text-success mt-2">
                    <i className="bi bi-check-circle me-1" />
                    {selectedFileName}
                  </div>
                )}
              </div>

              <div className="d-flex align-items-center gap-3 my-3">
                <div className="border-top flex-grow-1" />

                <span className="text-muted small">veya</span>

                <div className="border-top flex-grow-1" />
              </div>

              <div>
                <label
                  htmlFor="blogCoverImage"
                  className="form-label fw-semibold"
                >
                  Görsel Bağlantısı
                </label>

                <input
                  id="blogCoverImage"
                  type="text"
                  className={`form-control ${
                    errors.coverImage ? "is-invalid" : ""
                  }`}
                  placeholder="https://ornek.com/gorsel.jpg"
                  disabled={isSubmitting}
                  {...register("coverImage", {
                    onChange: handleImageUrlChange,
                  })}
                />

                {errors.coverImage && (
                  <div className="invalid-feedback">
                    {errors.coverImage.message}
                  </div>
                )}
              </div>

              {imagePreview && !errors.coverImage && (
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <p className="small fw-semibold mb-0">Görsel Önizleme</p>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleRemoveImage}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-trash me-1" />
                      Kaldır
                    </button>
                  </div>

                  {!imageLoadError ? (
                    <img
                      src={imagePreview}
                      alt="Blog kapak önizlemesi"
                      className="img-fluid rounded border"
                      style={{
                        width: "100%",
                        height: "190px",
                        objectFit: "cover",
                      }}
                      onError={() => setImageLoadError(true)}
                      onLoad={() => setImageLoadError(false)}
                    />
                  ) : (
                    <div className="alert alert-warning small mb-0">
                      <i className="bi bi-exclamation-triangle me-2" />
                      Görsel yüklenemedi. Bağlantıyı kontrol ediniz.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2">
            <Link
              to="/admin/blog"
              className={`btn btn-outline-secondary ${
                isSubmitting ? "disabled" : ""
              }`}
              aria-disabled={isSubmitting}
            >
              <i className="bi bi-x-lg me-2" />
              Vazgeç
            </Link>

            <button
              type="submit"
              className="btn btn-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2" />
                  {submitButtonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BlogForm;

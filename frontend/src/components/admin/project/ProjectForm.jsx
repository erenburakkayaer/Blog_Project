import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const validationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("Proje başlığı zorunludur.")
    .min(3, "Proje başlığı en az 3 karakter olmalıdır.")
    .max(120, "Proje başlığı en fazla 120 karakter olabilir."),

  summary: yup
    .string()
    .trim()
    .required("Kısa açıklama zorunludur.")
    .min(10, "Kısa açıklama en az 10 karakter olmalıdır.")
    .max(250, "Kısa açıklama en fazla 250 karakter olabilir."),

  description: yup
    .string()
    .trim()
    .required("Detaylı açıklama zorunludur.")
    .min(20, "Detaylı açıklama en az 20 karakter olmalıdır."),

  client: yup
    .string()
    .trim()
    .required("Müşteri bilgisi zorunludur.")
    .max(100, "Müşteri bilgisi en fazla 100 karakter olabilir."),

  category: yup.string().required("Kategori seçiniz."),

  technologies: yup.string().trim().required("En az bir teknoloji giriniz."),

  coverImage: yup
    .string()
    .trim()
    .required("Kapak görseli zorunludur.")
    .url("Geçerli bir görsel URL'si giriniz."),

  projectUrl: yup
    .string()
    .transform((value) => value?.trim() || "")
    .test(
      "valid-project-url",
      "Geçerli bir proje URL'si giriniz.",
      (value) => !value || yup.string().url().isValidSync(value),
    ),

  repositoryUrl: yup
    .string()
    .transform((value) => value?.trim() || "")
    .test(
      "valid-repository-url",
      "Geçerli bir repository URL'si giriniz.",
      (value) => !value || yup.string().url().isValidSync(value),
    ),

  startDate: yup.string().required("Başlangıç tarihi zorunludur."),

  endDate: yup
    .string()
    .test(
      "end-date-after-start-date",
      "Bitiş tarihi başlangıç tarihinden önce olamaz.",
      function validateEndDate(value) {
        const { startDate } = this.parent;

        if (!value || !startDate) {
          return true;
        }

        return new Date(value) >= new Date(startDate);
      },
    ),

  status: yup
    .string()
    .oneOf(["published", "draft"], "Geçerli bir durum seçiniz.")
    .required("Durum seçiniz."),

  featured: yup.boolean(),
});

const defaultFormValues = {
  title: "",
  summary: "",
  description: "",
  client: "",
  category: "",
  technologies: "",
  coverImage: "",
  projectUrl: "",
  repositoryUrl: "",
  startDate: "",
  endDate: "",
  status: "draft",
  featured: false,
};

const ProjectForm = ({
  initialValues,
  onSubmit,
  submitButtonText,
  isSaving,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...defaultFormValues,
      ...initialValues,
      technologies: Array.isArray(initialValues?.technologies)
        ? initialValues.technologies.join(", ")
        : initialValues?.technologies || "",
    },
  });

  const imagePreview = useWatch({
    control,
    name: "coverImage",
  });

  useEffect(() => {
    reset({
      ...defaultFormValues,
      ...initialValues,
      technologies: Array.isArray(initialValues?.technologies)
        ? initialValues.technologies.join(", ")
        : initialValues?.technologies || "",
    });
  }, [initialValues, reset]);

  const submitForm = (formData) => {
    const normalizedData = {
      ...formData,
      title: formData.title.trim(),
      summary: formData.summary.trim(),
      description: formData.description.trim(),
      client: formData.client.trim(),
      coverImage: formData.coverImage.trim(),
      projectUrl: formData.projectUrl.trim(),
      repositoryUrl: formData.repositoryUrl.trim(),
      technologies: formData.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
    };

    return onSubmit(normalizedData);
  };

  const submitting = isSaving || isSubmitting;

  return (
    <form onSubmit={handleSubmit(submitForm)} noValidate>
      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h2 className="h5 mb-0">Proje Bilgileri</h2>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="project-title" className="form-label">
                  Proje Başlığı
                </label>

                <input
                  id="project-title"
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  placeholder="Örnek: Kurumsal Web Platformu"
                  {...register("title")}
                />

                {errors.title && (
                  <div className="invalid-feedback">{errors.title.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="project-summary" className="form-label">
                  Kısa Açıklama
                </label>

                <textarea
                  id="project-summary"
                  rows="3"
                  className={`form-control ${
                    errors.summary ? "is-invalid" : ""
                  }`}
                  placeholder="Projeyi birkaç cümleyle özetleyin."
                  {...register("summary")}
                />

                {errors.summary && (
                  <div className="invalid-feedback">
                    {errors.summary.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="project-description" className="form-label">
                  Detaylı Açıklama
                </label>

                <textarea
                  id="project-description"
                  rows="8"
                  className={`form-control ${
                    errors.description ? "is-invalid" : ""
                  }`}
                  placeholder="Projenin kapsamını, özelliklerini ve hedeflerini açıklayın."
                  {...register("description")}
                />

                {errors.description && (
                  <div className="invalid-feedback">
                    {errors.description.message}
                  </div>
                )}
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="project-client" className="form-label">
                    Müşteri
                  </label>

                  <input
                    id="project-client"
                    type="text"
                    className={`form-control ${
                      errors.client ? "is-invalid" : ""
                    }`}
                    placeholder="Müşteri veya şirket adı"
                    {...register("client")}
                  />

                  {errors.client && (
                    <div className="invalid-feedback">
                      {errors.client.message}
                    </div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="project-category" className="form-label">
                    Kategori
                  </label>

                  <select
                    id="project-category"
                    className={`form-select ${
                      errors.category ? "is-invalid" : ""
                    }`}
                    {...register("category")}
                  >
                    <option value="">Kategori seçiniz</option>
                    <option value="Web">Web</option>
                    <option value="Mobil">Mobil</option>
                    <option value="Yapay Zekâ">Yapay Zekâ</option>
                    <option value="Siber Güvenlik">Siber Güvenlik</option>
                  </select>

                  {errors.category && (
                    <div className="invalid-feedback">
                      {errors.category.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <label htmlFor="project-technologies" className="form-label">
                  Teknolojiler
                </label>

                <input
                  id="project-technologies"
                  type="text"
                  className={`form-control ${
                    errors.technologies ? "is-invalid" : ""
                  }`}
                  placeholder="React, ASP.NET Core, PostgreSQL"
                  {...register("technologies")}
                />

                <div className="form-text">
                  Teknolojileri virgülle ayırarak girin.
                </div>

                {errors.technologies && (
                  <div className="invalid-feedback">
                    {errors.technologies.message}
                  </div>
                )}
              </div>

              <div className="row g-3 mt-1">
                <div className="col-12 col-md-6">
                  <label htmlFor="project-url" className="form-label">
                    Proje URL
                  </label>

                  <input
                    id="project-url"
                    type="url"
                    className={`form-control ${
                      errors.projectUrl ? "is-invalid" : ""
                    }`}
                    placeholder="https://example.com"
                    {...register("projectUrl")}
                  />

                  {errors.projectUrl && (
                    <div className="invalid-feedback">
                      {errors.projectUrl.message}
                    </div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="repository-url" className="form-label">
                    Repository URL
                  </label>

                  <input
                    id="repository-url"
                    type="url"
                    className={`form-control ${
                      errors.repositoryUrl ? "is-invalid" : ""
                    }`}
                    placeholder="https://github.com/..."
                    {...register("repositoryUrl")}
                  />

                  {errors.repositoryUrl && (
                    <div className="invalid-feedback">
                      {errors.repositoryUrl.message}
                    </div>
                  )}
                </div>
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
              <div className="mb-3">
                <label htmlFor="project-status" className="form-label">
                  Durum
                </label>

                <select
                  id="project-status"
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

              <div className="form-check form-switch">
                <input
                  id="project-featured"
                  type="checkbox"
                  className="form-check-input"
                  {...register("featured")}
                />

                <label htmlFor="project-featured" className="form-check-label">
                  Öne çıkan proje
                </label>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h2 className="h5 mb-0">Proje Tarihleri</h2>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="project-start-date" className="form-label">
                  Başlangıç Tarihi
                </label>

                <input
                  id="project-start-date"
                  type="date"
                  className={`form-control ${
                    errors.startDate ? "is-invalid" : ""
                  }`}
                  {...register("startDate")}
                />

                {errors.startDate && (
                  <div className="invalid-feedback">
                    {errors.startDate.message}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="project-end-date" className="form-label">
                  Bitiş Tarihi
                </label>

                <input
                  id="project-end-date"
                  type="date"
                  className={`form-control ${
                    errors.endDate ? "is-invalid" : ""
                  }`}
                  {...register("endDate")}
                />

                {errors.endDate && (
                  <div className="invalid-feedback">
                    {errors.endDate.message}
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
              <label htmlFor="project-cover-image" className="form-label">
                Görsel URL
              </label>

              <input
                id="project-cover-image"
                type="url"
                className={`form-control ${
                  errors.coverImage ? "is-invalid" : ""
                }`}
                placeholder="https://..."
                {...register("coverImage")}
              />

              {errors.coverImage && (
                <div className="invalid-feedback">
                  {errors.coverImage.message}
                </div>
              )}

              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Proje kapak önizlemesi"
                    className="img-fluid rounded border"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-dark px-4"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle me-2" />
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

ProjectForm.propTypes = {
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    summary: PropTypes.string,
    description: PropTypes.string,
    client: PropTypes.string,
    category: PropTypes.string,
    technologies: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    coverImage: PropTypes.string,
    projectUrl: PropTypes.string,
    repositoryUrl: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    status: PropTypes.string,
    featured: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string,
  isSaving: PropTypes.bool,
};

ProjectForm.defaultProps = {
  initialValues: defaultFormValues,
  submitButtonText: "Projeyi Kaydet",
  isSaving: false,
};

export default ProjectForm;

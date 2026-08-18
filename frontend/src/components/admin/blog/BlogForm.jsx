import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import { FormActions, FormInput, FormSelect, FormTextarea } from "../../form";
import { ImageUploader } from "../../ui";

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

const statusOptions = [
  {
    value: "draft",
    label: "Taslak",
  },
  {
    value: "published",
    label: "Yayında",
  },
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
  const [imageUploaderError, setImageUploaderError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    reset({
      ...defaultValues,
      ...initialValues,
      coverImage: initialValues?.coverImage || "",
    });
  }, [initialValues, reset]);

  const summary =
    useWatch({
      control,
      name: "summary",
    }) || "";

  const content =
    useWatch({
      control,
      name: "content",
    }) || "";

  const coverImage =
    useWatch({
      control,
      name: "coverImage",
    }) || "";

  const handleImageUploadChange = ({ value, error = "" }) => {
    if (error) {
      setImageUploaderError(error);
      toast.error(error);
      return;
    }

    const normalizedValue = typeof value === "string" ? value : "";

    setImageUploaderError("");

    setValue("coverImage", normalizedValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    clearErrors("coverImage");

    if (normalizedValue) {
      toast.success("Kapak görseli seçildi.");
    }
  };

  const handleImageUrlChange = async (event) => {
    const imageUrl = event.target.value;

    setImageUploaderError("");

    setValue("coverImage", imageUrl, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (!imageUrl.trim()) {
      clearErrors("coverImage");
      return;
    }

    await trigger("coverImage");
  };

  const handleImageUrlBlur = async () => {
    await trigger("coverImage");
  };

  const handleRemoveImage = () => {
    setImageUploaderError("");

    setValue("coverImage", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    clearErrors("coverImage");
  };

  const handleValidSubmit = (formValues) => {
    const normalizedValues = {
      ...formValues,
      title: formValues.title.trim(),
      author: formValues.author.trim(),
      summary: formValues.summary.trim(),
      content: formValues.content.trim(),
      coverImage: formValues.coverImage || "",
    };

    onSubmit(normalizedValues);
  };

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} noValidate>
      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h2 className="h5 mb-0">Blog İçeriği</h2>
            </div>

            <div className="card-body">
              <FormInput
                id="blogTitle"
                label="Blog Başlığı"
                placeholder="Örneğin: Yapay Zekâ ile İş Süreçlerini Dönüştürme"
                required
                disabled={isSubmitting}
                error={errors.title?.message}
                className="mb-4"
                register={register("title")}
              />

              <FormTextarea
                id="blogSummary"
                label="Kısa Özet"
                placeholder="Blog yazısının kısa açıklamasını giriniz."
                rows={4}
                maxLength={300}
                characterCount={summary.length}
                required
                disabled={isSubmitting}
                error={errors.summary?.message}
                className="mb-4"
                register={register("summary")}
              />

              <FormTextarea
                id="blogContent"
                label="Blog İçeriği"
                placeholder="Blog içeriğini buraya yazınız..."
                rows={14}
                characterCount={content.length}
                required
                disabled={isSubmitting}
                error={errors.content?.message}
                register={register("content")}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h2 className="h5 mb-0">Yayın Ayarları</h2>
            </div>

            <div className="card-body">
              <FormSelect
                id="blogCategory"
                label="Kategori"
                options={blogCategories}
                placeholder="Kategori seçiniz"
                required
                disabled={isSubmitting}
                error={errors.category?.message}
                className="mb-4"
                register={register("category")}
              />

              <FormInput
                id="blogAuthor"
                label="Yazar"
                placeholder="Yazar adı"
                required
                disabled={isSubmitting}
                error={errors.author?.message}
                className="mb-4"
                register={register("author")}
              />

              <FormSelect
                id="blogStatus"
                label="Yayın Durumu"
                options={statusOptions}
                placeholder={null}
                required
                disabled={isSubmitting}
                error={errors.status?.message}
                register={register("status")}
              />
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h2 className="h5 mb-0">Kapak Görseli</h2>
            </div>

            <div className="card-body">
              <ImageUploader
                id="blogCoverImageFile"
                label="Bilgisayardan Görsel Seç"
                value={coverImage.startsWith("data:image/") ? coverImage : ""}
                maxSizeMb={2}
                previewHeight="190px"
                helperText="JPG, PNG veya WEBP formatı. En fazla 2 MB."
                error={imageUploaderError}
                onChange={handleImageUploadChange}
              />

              <div className="d-flex align-items-center gap-3 my-4">
                <div className="border-top flex-grow-1" />

                <span className="text-muted small">veya</span>

                <div className="border-top flex-grow-1" />
              </div>

              <FormInput
                id="blogCoverImage"
                label="Görsel Bağlantısı"
                placeholder="https://ornek.com/gorsel.jpg"
                disabled={isSubmitting}
                error={errors.coverImage?.message}
                helpText="HTTP veya HTTPS ile başlayan geçerli bir görsel bağlantısı giriniz."
                value={coverImage.startsWith("data:image/") ? "" : coverImage}
                onChange={handleImageUrlChange}
                onBlur={handleImageUrlBlur}
              />

              {coverImage &&
                !coverImage.startsWith("data:image/") &&
                !errors.coverImage && (
                  <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <p className="small fw-semibold mb-0">Görsel Ön İzleme</p>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleRemoveImage}
                        disabled={isSubmitting}
                      >
                        <i className="bi bi-trash me-1" aria-hidden="true" />
                        Kaldır
                      </button>
                    </div>

                    <img
                      src={coverImage}
                      alt="Blog kapak ön izlemesi"
                      className="img-fluid rounded border"
                      style={{
                        width: "100%",
                        height: "190px",
                        objectFit: "cover",
                      }}
                      onError={() => {
                        setImageUploaderError(
                          "Görsel yüklenemedi. Bağlantıyı kontrol ediniz.",
                        );
                      }}
                      onLoad={() => {
                        setImageUploaderError("");
                      }}
                    />

                    {imageUploaderError && (
                      <div className="alert alert-warning small mt-2 mb-0">
                        <i
                          className="bi bi-exclamation-triangle me-2"
                          aria-hidden="true"
                        />
                        {imageUploaderError}
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <FormActions
            cancelTo="/admin/blog"
            submitLabel={submitButtonText}
            loadingLabel="Kaydediliyor..."
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};

export default BlogForm;

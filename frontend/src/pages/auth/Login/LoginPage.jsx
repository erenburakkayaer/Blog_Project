import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useAuth } from "../../../context/AuthContext";

const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Geçerli bir e-posta adresi girin.")
    .required("E-posta adresi zorunludur."),

  password: yup
    .string()
    .required("Şifre zorunludur.")
    .min(6, "Şifre en az 6 karakter olmalıdır."),

  rememberMe: yup.boolean().default(true),
});

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const from = location.state?.from?.pathname || "/admin";

  const onSubmit = async (formData) => {
    try {
      await login(formData);

      toast.success("Giriş başarılı. Yönetim paneline yönlendiriliyorsunuz.");

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      toast.error(error.message || "Giriş sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="surface-card p-4 p-sm-5">
      <div className="d-lg-none mb-4">
        <Link
          className="d-inline-flex align-items-center gap-2 text-dark"
          to="/"
        >
          <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary p-2 text-light">
            <i className="bi bi-code-slash" />
          </span>

          <span className="fs-4 fw-bold">TechNova</span>
        </Link>
      </div>

      <div className="mb-4">
        <span className="text-primary fw-semibold">Yönetim paneli</span>

        <h1 className="h2 fw-bold mt-2 mb-2">Tekrar hoş geldiniz</h1>

        <p className="text-secondary mb-0">
          Yönetim paneline erişmek için hesap bilgilerinizi girin.
        </p>
      </div>

      <div className="alert alert-primary small" role="alert">
        <div className="fw-semibold mb-1">Geçici test hesabı</div>
        <div>E-posta: admin@technova.com</div>
        <div>Şifre: Admin123!</div>
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="email">
            E-posta adresi
          </label>

          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-envelope" />
            </span>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ornek@technova.com"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email")}
            />

            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold" htmlFor="password">
            Şifre
          </label>

          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-lock" />
            </span>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Şifrenizi girin"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              {...register("password")}
            />

            <button
              className="btn btn-outline-secondary"
              type="button"
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              onClick={() => setShowPassword((current) => !current)}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
            </button>

            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
          <div className="form-check">
            <input
              id="rememberMe"
              type="checkbox"
              className="form-check-input"
              {...register("rememberMe")}
            />

            <label className="form-check-label" htmlFor="rememberMe">
              Beni hatırla
            </label>
          </div>

          <button
            className="btn btn-link p-0 text-decoration-none"
            type="button"
            onClick={() =>
              toast("Şifre yenileme özelliği daha sonra eklenecek.")
            }
          >
            Şifremi unuttum
          </button>
        </div>

        <button
          className="btn btn-primary btn-lg w-100"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              />
              Giriş yapılıyor...
            </>
          ) : (
            <>
              <i className="bi bi-box-arrow-in-right me-2" />
              Giriş Yap
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-4">
        <Link className="text-secondary" to="/">
          <i className="bi bi-arrow-left me-2" />
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;

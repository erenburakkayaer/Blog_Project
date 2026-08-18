import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Form states for Register
  const [regRole, setRegRole] = useState("yazar");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      rememberMe: true,
    },
  });

  const from = location.state?.from?.pathname || "/admin";

  const onSubmit = async (formData) => {
    try {
      if (mode === "login") {
        await login(formData);
        toast.success("Giriş başarılı! Yönetim paneline yönlendiriliyorsunuz.");
        navigate(from, { replace: true });
      } else {
        // Register Simulation
        toast.success(`Kayıt başarılı! (${regRole.toUpperCase()} olarak oluşturuldu). Şimdi giriş yapabilirsiniz.`);
        setMode("login");
      }
    } catch (error) {
      toast.error(error.message || "Giriş işlemi başarısız.");
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Lütfen e-posta adresinizi giriniz.");
      return;
    }
    setForgotSent(true);
    toast.success("Şifre sıfırlama bağlantısı e-postanıza gönderildi!");
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "2.5rem" }}>
      {/* Mobile Brand */}
      <div className="d-lg-none mb-4 text-center">
        <Link className="d-inline-flex align-items-center gap-2 text-dark text-decoration-none" to="/">
          <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary p-2 text-light">
            <i className="bi bi-lightning-fill" />
          </span>
          <span className="fs-4 fw-bold">TechNova</span>
        </Link>
      </div>

      {/* Mode Tabs Header */}
      <div className="d-flex rounded-3 p-1 mb-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <button
          type="button"
          className={`btn w-50 fw-semibold rounded-2 py-2 transition-all ${mode === "login" ? "btn-primary text-white" : "text-secondary"}`}
          onClick={() => setMode("login")}
        >
          <i className="bi bi-box-arrow-in-right me-2" />
          Giriş Yap
        </button>
        <button
          type="button"
          className={`btn w-50 fw-semibold rounded-2 py-2 transition-all ${mode === "register" ? "btn-primary text-white" : "text-secondary"}`}
          onClick={() => setMode("register")}
        >
          <i className="bi bi-person-plus me-2" />
          Kayıt Ol
        </button>
      </div>

      <div className="mb-4 text-center">
        <h1 className="h3 fw-bold mb-1">
          {mode === "login" ? "TechNova'ya Hoş Geldiniz" : "Hesap Oluşturun"}
        </h1>
        <p className="text-secondary small mb-0">
          {mode === "login"
            ? "Projelerinizi yönetmek ve yazar kazanç bakiyenizi takip etmek için giriş yapın."
            : "TechNova platformunda yazar, geliştirici veya şirket hesabı oluşturun."}
        </p>
      </div>

      {/* Demo Credentials Alert */}
      {mode === "login" && (
        <div className="alert alert-primary small border-0 mb-4" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>
          <div className="fw-bold mb-1"><i className="bi bi-key-fill me-1" /> Hızlı Test Hesabı:</div>
          <div>E-posta: <strong>admin@technova.com</strong></div>
          <div>Şifre: <strong>Admin123!</strong></div>
        </div>
      )}

      {/* Social Login Buttons */}
      <div className="d-flex gap-2 mb-4">
        <button
          type="button"
          className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 py-2"
          style={{ borderRadius: 10, fontSize: "0.88rem" }}
          onClick={() => toast.success("Google ile giriş başarılı (Simülasyon)")}
        >
          <i className="bi bi-google text-danger" /> Google ile
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 py-2"
          style={{ borderRadius: 10, fontSize: "0.88rem" }}
          onClick={() => toast.success("GitHub ile giriş başarılı (Simülasyon)")}
        >
          <i className="bi bi-github" /> GitHub ile
        </button>
      </div>

      <div className="position-relative text-center mb-4">
        <hr className="border-secondary opacity-25" />
        <span className="position-absolute top-50 start-50 translate-middle px-3 text-secondary small" style={{ background: "var(--color-surface, #1e293b)" }}>
          veya e-posta ile
        </span>
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name for Register */}
        {mode === "register" && (
          <div className="mb-3">
            <label className="form-label fw-semibold small">Ad Soyad *</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-person" /></span>
              <input
                type="text"
                className="form-control contact-input"
                placeholder="Samet Başkale"
                {...register("fullName")}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="mb-3">
          <label className="form-label fw-semibold small">E-posta adresi *</label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-envelope" /></span>
            <input
              type="email"
              autoComplete="email"
              placeholder="ornek@technova.com"
              className="form-control contact-input"
              {...register("email")}
              required
            />
          </div>
        </div>

        {/* Role Select for Register */}
        {mode === "register" && (
          <div className="mb-3">
            <label className="form-label fw-semibold small">Hesap Türü / Rol *</label>
            <select
              className="form-select contact-input"
              value={regRole}
              onChange={(e) => setRegRole(e.target.value)}
            >
              <option value="yazar">✍️ Yazar (Blog Yazıp Para Kazan)</option>
              <option value="gelistirici">💻 Geliştirici (Proje Sergile & Boost Et)</option>
              <option value="isveren">🏢 Şirket / İşveren (Yetenek Ara & İlan Ver)</option>
            </select>
          </div>
        )}

        {/* Password */}
        <div className="mb-3">
          <label className="form-label fw-semibold small">Şifre *</label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-lock" /></span>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="form-control contact-input"
              {...register("password")}
              required
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowPassword((p) => !p)}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
            </button>
          </div>
        </div>

        {/* Checkbox / Forgot password */}
        {mode === "login" && (
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="form-check">
              <input id="rememberMe" type="checkbox" className="form-check-input" defaultChecked />
              <label className="form-check-label small" htmlFor="rememberMe">Beni hatırla</label>
            </div>

            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none small text-primary"
              onClick={() => { setShowForgotModal(true); setForgotSent(false); }}
            >
              Şifremi unuttum?
            </button>
          </div>
        )}

        <button
          className="btn btn-primary btn-lg w-100 fw-bold py-3"
          type="submit"
          disabled={isLoading}
          style={{ borderRadius: 12 }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              İşlem Yapılıyor...
            </>
          ) : mode === "login" ? (
            <>
              <i className="bi bi-box-arrow-in-right me-2" />
              Giriş Yap
            </>
          ) : (
            <>
              <i className="bi bi-person-check me-2" />
              Ücretsiz Kayıt Ol
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-4">
        <Link className="text-secondary small text-decoration-none" to="/">
          <i className="bi bi-arrow-left me-1" /> Ana Sayfaya Dön
        </Link>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content surface-card p-4" style={{ borderRadius: 20 }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Şifremi Unuttum</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowForgotModal(false)} />
              </div>
              <div className="modal-body py-3">
                {forgotSent ? (
                  <div className="text-center py-3">
                    <i className="bi bi-check-circle-fill text-success fs-1 mb-2 d-block" />
                    <p className="fw-semibold">Şifre sıfırlama talimatı gönderildi!</p>
                    <p className="text-secondary small">Lütfen <strong>{forgotEmail}</strong> e-posta kutunuzu kontrol edin.</p>
                    <button className="btn btn-primary w-100 mt-2" onClick={() => setShowForgotModal(false)}>Kapat</button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit}>
                    <p className="text-secondary small mb-3">Hesabınıza ait e-posta adresinizi girin, sıfırlama bağlantısını iletelim.</p>
                    <input
                      type="email"
                      className="form-control contact-input mb-3"
                      placeholder="ornek@technova.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2" style={{ borderRadius: 10 }}>
                      Sıfırlama Bağlantısı Gönder
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

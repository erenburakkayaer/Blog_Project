import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register: authRegister, isLoading } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Form states for Register
  const [regRole, setRegRole] = useState("author");

  const {
    register,
    handleSubmit,
    setValue,
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
        // Direct Register & Login Flow with Selected Role
        const roleMapping = {
          author: { label: "Yazar & İçerik Üreticisi", role: "author" },
          editor: { label: "Geliştirici", role: "editor" },
          hr: { label: "İnsan Kaynakları (İK)", role: "hr" },
          user: { label: "Öğrenci / Üye", role: "user" },
        };

        const targetRole = roleMapping[regRole] || { label: "Yazar", role: "author" };

        await login({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName || "Yeni Kullanıcı",
          role: targetRole.role,
        });

        toast.success(`🎉 Tebrikler! ${targetRole.label} olarak kaydınız oluşturuldu ve giriş yapıldı!`);
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "İşlem başarısız.");
    }
  };

  const handleQuickRoleLogin = async (roleKey) => {
    const roleAccounts = {
      admin: { email: "admin@technova.com", pass: "Admin123!", label: "👑 Şirket Yöneticisi" },
      hr: { email: "ik@technova.com", pass: "Ik123!", label: "👥 İnsan Kaynakları (İK)" },
      author: { email: "yazar@technova.com", pass: "Yazar123!", label: "✍️ Yazar & İçerik Üreticisi" },
      editor: { email: "dev@technova.com", pass: "Dev123!", label: "💻 Geliştirici" },
      user: { email: "ogrenci@technova.com", pass: "User123!", label: "👤 Öğrenci / Üye" },
    };

    const target = roleAccounts[roleKey];
    if (target) {
      setValue("email", target.email);
      setValue("password", target.pass);
      await login({ email: target.email, password: target.pass });
      toast.success(`${target.label} olarak giriş yapıldı!`);
      navigate("/admin", { replace: true });
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
            : "TechNova platformunda yazar, geliştirici, İK veya üye hesabı oluşturun."}
        </p>
      </div>

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
                placeholder="Örn: Samet Başkale"
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
              <option value="author">✍️ Yazar (Blog Yazıp Para Kazan & Bakiye Takip)</option>
              <option value="editor">💻 Geliştirici (Proje Sergile & Boost Et)</option>
              <option value="hr">👥 İnsan Kaynakları (İş/Staj İlanı Ver & CV İncele)</option>
              <option value="user">👤 Öğrenci / Normal Üye (İçerikleri İncele & Yorum Yap)</option>
            </select>
            <div className="form-text small text-white-50" style={{ fontSize: "11px" }}>
              Kayıt olduğunuzda paneliniz bu role göre otomatik özelleştirilecektir.
            </div>
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
          className="btn btn-primary btn-lg w-100 fw-bold py-3 shadow-sm"
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
              Ücretsiz Kayıt Ol & Panele Git
            </>
          )}
        </button>
      </form>

      {/* QUICK ROLE DEMO SELECTOR (HER ROLLERİ CANLI TEST ETMEK İÇİN) */}
      <div className="mt-4 p-3 rounded-4 bg-black bg-opacity-30 border border-white border-opacity-10">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fw-bold small text-white-50" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
            ⚡ HIZLI ROL İLE TEST GİRİŞİ:
          </span>
          <span className="badge bg-primary bg-opacity-25 text-white" style={{ fontSize: "9px" }}>
            Tek Tıkla Giriş
          </span>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1 text-white"
            style={{ fontSize: "11px" }}
            onClick={() => handleQuickRoleLogin("admin")}
          >
            👑 Şirket Yöneticisi
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-warning rounded-pill px-3 py-1 text-white"
            style={{ fontSize: "11px" }}
            onClick={() => handleQuickRoleLogin("hr")}
          >
            👥 İnsan Kaynakları
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 text-white"
            style={{ fontSize: "11px" }}
            onClick={() => handleQuickRoleLogin("author")}
          >
            ✍️ Yazar
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-info rounded-pill px-3 py-1 text-white"
            style={{ fontSize: "11px" }}
            onClick={() => handleQuickRoleLogin("editor")}
          >
            💻 Geliştirici
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 text-white"
            style={{ fontSize: "11px" }}
            onClick={() => handleQuickRoleLogin("user")}
          >
            👤 Öğrenci / Üye
          </button>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link className="text-secondary small text-decoration-none" to="/">
          <i className="bi bi-arrow-left me-1" /> Ana Sayfaya Dön
        </Link>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light px-4 py-3 border-bottom">
                <h5 className="modal-title fw-bold text-dark fs-6">
                  <i className="bi bi-key-fill me-2 text-primary" />
                  Şifre Sıfırlama
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowForgotModal(false)} />
              </div>

              <form onSubmit={handleForgotSubmit}>
                <div className="modal-body p-4">
                  {forgotSent ? (
                    <div className="text-center py-3">
                      <div className="text-success display-4 mb-2"><i className="bi bi-check-circle-fill" /></div>
                      <h6 className="fw-bold text-dark mb-1">E-posta Gönderildi!</h6>
                      <p className="text-secondary small mb-0">
                        {forgotEmail} adresine şifre sıfırlama bağlantısı iletildi.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-secondary small mb-3">
                        Kayıtlı e-posta adresinizi girin, size şifrenizi sıfırlayabileceğiniz bir bağlantı gönderelim.
                      </p>
                      <input
                        type="email"
                        className="form-control rounded-3"
                        placeholder="ornek@technova.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </>
                  )}
                </div>

                <div className="modal-footer bg-light px-4 py-3 border-top">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowForgotModal(false)}>
                    Kapat
                  </button>
                  {!forgotSent && (
                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold">
                      Sıfırlama Bağlantısı Gönder
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

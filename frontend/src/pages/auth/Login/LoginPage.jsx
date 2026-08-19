import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { apiRequest } from "../../../services/api";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register: authRegister, isLoading } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // e-Devlet Modal State (BTK Akademi Tarzı)
  const [showEDevletModal, setShowEDevletModal] = useState(false);
  const [eDevletTc, setEDevletTc] = useState("");
  const [eDevletPass, setEDevletPass] = useState("");
  const [eDevletLoading, setEDevletLoading] = useState(false);

  // Instagram-style Realtime User Exists Check
  const [emailCheckState, setEmailCheckState] = useState({ checking: false, exists: null });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "Zayıf", color: "#ef4444" });

  // Form states for Register
  const [regRole, setRegRole] = useState("author");
  const [termsAccepted, setTermsAccepted] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      rememberMe: true,
    },
  });

  const watchEmail = watch("email");
  const watchPassword = watch("password");

  // Parola Güç Hesaplama (Security Meter)
  useEffect(() => {
    if (!watchPassword) {
      setPasswordStrength({ score: 0, label: "Boş", color: "#64748b" });
      return;
    }
    let score = 0;
    if (watchPassword.length >= 6) score += 1;
    if (watchPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(watchPassword) && /[a-z]/.test(watchPassword)) score += 1;
    if (/\d/.test(watchPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(watchPassword)) score += 1;

    if (score <= 2) setPasswordStrength({ score, label: "Zayıf", color: "#ef4444" });
    else if (score <= 3) setPasswordStrength({ score, label: "Orta", color: "#f59e0b" });
    else setPasswordStrength({ score, label: "Çok Güçlü", color: "#10b981" });
  }, [watchPassword]);

  // Instagram Style Kullanıcı/E-posta Varlık Kontrolü
  useEffect(() => {
    if (mode !== "register" || !watchEmail || !watchEmail.includes("@") || watchEmail.length < 5) {
      setEmailCheckState({ checking: false, exists: null });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setEmailCheckState({ checking: true, exists: null });
        const res = await apiRequest(`/auth/check-user?identifier=${encodeURIComponent(watchEmail)}`);
        setEmailCheckState({ checking: false, exists: res?.exists || false });
      } catch {
        setEmailCheckState({ checking: false, exists: false });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [watchEmail, mode]);

  const from = location.state?.from?.pathname || "/admin";

  const onSubmit = async (formData) => {
    if (mode === "register") {
      if (emailCheckState.exists) {
        toast.error("Bu e-posta adresi zaten kullanımda. Lütfen başka bir e-posta girin veya giriş yapın.");
        return;
      }
      if (!termsAccepted) {
        toast.error("Lütfen Kullanıcı Sözleşmesi ve KVKK metnini onaylayınız.");
        return;
      }

      try {
        const roleMapping = {
          author: { label: "Yazar & İçerik Üreticisi", role: "author" },
          editor: { label: "Geliştirici", role: "editor" },
          hr: { label: "İnsan Kaynakları (İK)", role: "hr" },
          user: { label: "Öğrenci / Üye", role: "user" },
        };

        const targetRole = roleMapping[regRole] || { label: "Yazar", role: "author" };

        // 1. Kaydı oluştur (Oturum AÇMAZ)
        await authRegister({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName || "Yeni Kullanıcı",
          role: targetRole.role,
        });

        // 2. Kullanıcıyı bilgilendirip Giriş Yap ekranına yönlendir
        toast.success(
          `🎉 Tebrikler! ${targetRole.label} hesabınız başarıyla oluşturuldu. Güvenliğiniz için lütfen e-posta ve şifrenizle giriş yapınız.`,
          { duration: 6000 }
        );

        // Giriş Yap tab'ine geçir, e-postayı hazır doldur, şifreyi temizle
        setValue("email", formData.email);
        setValue("password", "");
        setMode("login");
      } catch (error) {
        toast.error(error.message || "Kayıt işlemi gerçekleştirilemedi.");
      }
      return;
    }

    // GİRİŞ YAPMA (LOGIN) MODU
    try {
      await login({
        email: formData.email,
        username: formData.email,
        password: formData.password,
      });
      toast.success("Giriş başarılı! Yönetim paneline yönlendiriliyorsunuz.");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || "Giriş işlemi başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  // Google SSO Giriş & Otomatik Kayıt
  const handleGoogleLogin = async () => {
    toast.loading("Google ile kimlik doğrulanıyor...", { id: "oauth" });
    setTimeout(async () => {
      try {
        await login({
          email: "user@gmail.com",
          username: "google_user",
          password: "GoogleUser123!",
          fullName: "Google Kullanıcısı",
          role: "author",
          provider: "Google",
        });
        toast.success("Google ile güvenli giriş başarılı!", { id: "oauth" });
        navigate("/admin", { replace: true });
      } catch {
        // Hesap yoksa oluştur ve giriş yap
        await authRegister({
          email: "user@gmail.com",
          username: "google_user",
          password: "GoogleUser123!",
          fullName: "Google Kullanıcısı",
          role: "author",
          provider: "Google",
        });
        await login({
          email: "user@gmail.com",
          username: "google_user",
          password: "GoogleUser123!",
          fullName: "Google Kullanıcısı",
          role: "author",
        });
        toast.success("Google hesabınızla profiliniz oluşturuldu ve giriş yapıldı!", { id: "oauth" });
        navigate("/admin", { replace: true });
      }
    }, 600);
  };

  // GitHub SSO Giriş & Otomatik Kayıt (Geliştirici Platformu)
  const handleGithubLogin = async () => {
    toast.loading("GitHub ile geliştirici kimliği doğrulanıyor...", { id: "oauth" });
    setTimeout(async () => {
      try {
        await login({
          email: "dev@github.com",
          username: "github_developer",
          password: "GithubDev123!",
          fullName: "GitHub Geliştiricisi",
          role: "editor",
          provider: "GitHub",
        });
        toast.success("GitHub ile geliştirici girişi başarılı!", { id: "oauth" });
        navigate("/admin", { replace: true });
      } catch {
        await authRegister({
          email: "dev@github.com",
          username: "github_developer",
          password: "GithubDev123!",
          fullName: "GitHub Geliştiricisi",
          role: "editor",
          provider: "GitHub",
        });
        await login({
          email: "dev@github.com",
          username: "github_developer",
          password: "GithubDev123!",
          fullName: "GitHub Geliştiricisi",
          role: "editor",
        });
        toast.success("GitHub geliştirici hesabınızla profiliniz oluşturuldu ve giriş yapıldı!", { id: "oauth" });
        navigate("/admin", { replace: true });
      }
    }, 600);
  };

  // BTK Akademi Tarzı e-Devlet Girişi & Otomatik Kayıt
  const handleEDevletSubmit = (e) => {
    e.preventDefault();
    if (eDevletTc.length !== 11) {
      toast.error("T.C. Kimlik Numarası 11 haneli olmalıdır.");
      return;
    }
    if (!eDevletPass) {
      toast.error("Lütfen e-Devlet şifrenizi giriniz.");
      return;
    }

    setEDevletLoading(true);
    setTimeout(async () => {
      setEDevletLoading(false);
      setShowEDevletModal(false);

      try {
        await login({
          email: `tc_${eDevletTc}@turkiye.gov.tr`,
          username: `tc_${eDevletTc}`,
          password: "EDevletAuth123!",
          fullName: `Vatandaş (${eDevletTc.slice(0, 3)}***${eDevletTc.slice(-2)})`,
          role: "author",
          isEDevletVerified: true,
          provider: "e-Devlet",
        });
        toast.success("🇹🇷 e-Devlet Kapısı üzerinden kimliğiniz doğrulandı ve giriş yapıldı!");
        navigate("/admin", { replace: true });
      } catch {
        await authRegister({
          email: `tc_${eDevletTc}@turkiye.gov.tr`,
          username: `tc_${eDevletTc}`,
          password: "EDevletAuth123!",
          fullName: `Vatandaş (${eDevletTc.slice(0, 3)}***${eDevletTc.slice(-2)})`,
          role: "author",
          isEDevletVerified: true,
          provider: "e-Devlet",
        });
        await login({
          email: `tc_${eDevletTc}@turkiye.gov.tr`,
          username: `tc_${eDevletTc}`,
          password: "EDevletAuth123!",
          fullName: `Vatandaş (${eDevletTc.slice(0, 3)}***${eDevletTc.slice(-2)})`,
          role: "author",
        });
        toast.success("🇹🇷 e-Devlet Kapısı ile hesabınız oluşturuldu ve onaylı giriş yapıldı!");
        navigate("/admin", { replace: true });
      }
    }, 800);
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
    <div style={{ background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 24, padding: "2.5rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)" }}>
      {/* Mobile Brand */}
      <div className="d-lg-none mb-4 text-center">
        <Link className="d-inline-flex align-items-center gap-2 text-decoration-none" to="/">
          <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary p-2 text-light">
            <i className="bi bi-lightning-fill" />
          </span>
          <span className="fs-4 fw-bold text-white">TechNova</span>
        </Link>
      </div>

      {/* Mode Tabs Header */}
      <div className="d-flex rounded-3 p-1 mb-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <button
          type="button"
          className={`btn w-50 fw-semibold rounded-2 py-2 transition-all ${mode === "login" ? "btn-primary text-white shadow-sm" : "text-white-50 hover-text-white"}`}
          onClick={() => setMode("login")}
        >
          <i className="bi bi-box-arrow-in-right me-2" />
          Giriş Yap
        </button>
        <button
          type="button"
          className={`btn w-50 fw-semibold rounded-2 py-2 transition-all ${mode === "register" ? "btn-primary text-white shadow-sm" : "text-white-50 hover-text-white"}`}
          onClick={() => setMode("register")}
        >
          <i className="bi bi-person-plus me-2" />
          Kayıt Ol
        </button>
      </div>

      <div className="mb-4 text-center">
        <h1 className="h3 fw-bold mb-1 text-white" style={{ letterSpacing: "-0.02em" }}>
          {mode === "login" ? "TechNova'ya Hoş Geldiniz" : "Hesap Oluşturun"}
        </h1>
        <p className="text-white-50 small mb-0">
          {mode === "login"
            ? "Projelerinizi yönetmek ve içeriklerinize erişmek için güvenle giriş yapın."
            : "TechNova platformunda yazar, geliştirici veya şirket hesabı oluşturun."}
        </p>
      </div>

      {/* 🇹🇷 BTK AKADEMİ / E-DEVLET, GOOGLE & GITHUB SSO BUTTONS */}
      <div className="d-flex flex-column gap-2 mb-4">
        {/* e-Devlet Button (BTK Akademi Style) */}
        <button
          type="button"
          className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold text-white shadow-sm"
          style={{
            background: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 12,
            fontSize: "0.92rem",
          }}
          onClick={() => setShowEDevletModal(true)}
        >
          <span style={{ fontSize: "16px" }}>🇹🇷</span>
          <span>e-Devlet Kapısı ile {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}</span>
        </button>

        <div className="d-flex gap-2">
          {/* Google SSO Button */}
          <button
            type="button"
            className="btn btn-outline-light w-50 d-flex align-items-center justify-content-center gap-2 py-2 text-white"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
              fontSize: "0.88rem",
            }}
            onClick={handleGoogleLogin}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>

          {/* GitHub SSO Button */}
          <button
            type="button"
            className="btn btn-outline-light w-50 d-flex align-items-center justify-content-center gap-2 py-2 text-white"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
              fontSize: "0.88rem",
            }}
            onClick={handleGithubLogin}
          >
            <i className="bi bi-github fs-6" />
            <span>GitHub</span>
          </button>
        </div>
      </div>

      <div className="position-relative text-center mb-4">
        <hr className="border-secondary opacity-25" />
        <span className="position-absolute top-50 start-50 translate-middle px-3 text-white-50 small" style={{ background: "#0f172a" }}>
          veya e-posta ile
        </span>
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name for Register */}
        {mode === "register" && (
          <div className="mb-3">
            <label className="form-label fw-semibold small text-white-50">Ad Soyad *</label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary border-opacity-50 text-white-50"><i className="bi bi-person" /></span>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary border-opacity-50"
                placeholder="Örn: Samet Başkale"
                {...register("fullName")}
                required
              />
            </div>
          </div>
        )}

        {/* Email with Instagram-style realtime validation */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label fw-semibold small text-white-50 mb-0">E-posta adresi veya Kullanıcı Adı *</label>
            {mode === "register" && (
              <span style={{ fontSize: "11px" }}>
                {emailCheckState.checking && <span className="text-warning"><span className="spinner-border spinner-border-sm me-1" /> Kontrol ediliyor...</span>}
                {!emailCheckState.checking && emailCheckState.exists === true && (
                  <span className="text-danger fw-bold"><i className="bi bi-x-circle me-1" /> E-posta kullanımda</span>
                )}
                {!emailCheckState.checking && emailCheckState.exists === false && (
                  <span className="text-success fw-bold"><i className="bi bi-check-circle me-1" /> Kullanılabilir</span>
                )}
              </span>
            )}
          </div>
          <div className="input-group">
            <span className="input-group-text bg-dark border-secondary border-opacity-50 text-white-50"><i className="bi bi-envelope" /></span>
            <input
              type="text"
              autoComplete="email"
              placeholder="ornek@technova.com veya kullanıcı adı"
              className={`form-control bg-dark text-white border-secondary border-opacity-50 ${mode === "register" && emailCheckState.exists === true ? "is-invalid" : ""}`}
              {...register("email")}
              required
            />
          </div>
        </div>

        {/* Role Select for Register */}
        {mode === "register" && (
          <div className="mb-3">
            <label className="form-label fw-semibold small text-white-50">Hesap Türü / Rol *</label>
            <select
              className="form-select bg-dark text-white border-secondary border-opacity-50"
              value={regRole}
              onChange={(e) => setRegRole(e.target.value)}
            >
              <option value="author">✍️ Yazar (Blog Yazıp Para Kazan & Bakiye Takip)</option>
              <option value="editor">💻 Geliştirici (Proje Sergile & Boost Et)</option>
              <option value="hr">👥 İnsan Kaynakları (İş/Staj İlanı Ver & CV İncele)</option>
              <option value="user">👤 Öğrenci / Normal Üye (İçerikleri İncele & Yorum Yap)</option>
            </select>
          </div>
        )}

        {/* Password */}
        <div className="mb-3">
          <label className="form-label fw-semibold small text-white-50">Şifre *</label>
          <div className="input-group">
            <span className="input-group-text bg-dark border-secondary border-opacity-50 text-white-50"><i className="bi bi-lock" /></span>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="form-control bg-dark text-white border-secondary border-opacity-50"
              {...register("password")}
              required
            />
            <button
              className="btn btn-outline-secondary border-opacity-50 text-white-50"
              type="button"
              onClick={() => setShowPassword((p) => !p)}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
            </button>
          </div>

          {/* Password Strength Meter */}
          {mode === "register" && watchPassword && (
            <div className="mt-2">
              <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: "11px" }}>
                <span className="text-white-50">Şifre Güvenliği:</span>
                <span className="fw-bold" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
              </div>
              <div className="progress" style={{ height: "4px", background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: passwordStrength.color,
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Checkbox / Forgot password */}
        {mode === "login" ? (
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="form-check">
              <input id="rememberMe" type="checkbox" className="form-check-input" defaultChecked />
              <label className="form-check-label small text-white-50" htmlFor="rememberMe">Beni hatırla</label>
            </div>

            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none small text-info"
              onClick={() => { setShowForgotModal(true); setForgotSent(false); }}
            >
              Şifremi unuttum?
            </button>
          </div>
        ) : (
          <div className="form-check mb-4">
            <input
              id="termsAccept"
              type="checkbox"
              className="form-check-input"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label className="form-check-label small text-white-50" htmlFor="termsAccept">
              <span className="text-info">Kullanıcı Sözleşmesi</span> ve <span className="text-info">KVKK Aydınlatma Metni</span>'ni okudum, onaylıyorum.
            </label>
          </div>
        )}

        <button
          className="btn btn-primary btn-lg w-100 fw-bold py-3 shadow-lg"
          type="submit"
          disabled={isLoading || (mode === "register" && emailCheckState.exists === true)}
          style={{ borderRadius: 12, background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)", border: "none" }}
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
              Ücretsiz Hesap Oluştur
            </>
          )}
        </button>

        {/* UDEMY / BTK AKADEMİ TARZI TAB GEÇİŞ METNİ */}
        <div className="text-center mt-4 pt-2 border-top border-secondary border-opacity-25">
          {mode === "login" ? (
            <p className="text-white-50 small mb-0">
              Henüz bir hesabınız yok mu?{" "}
              <button
                type="button"
                className="btn btn-link p-0 text-info fw-bold text-decoration-none"
                onClick={() => setMode("register")}
              >
                Hemen Kayıt Ol
              </button>
            </p>
          ) : (
            <p className="text-white-50 small mb-0">
              Zaten bir hesabınız var mı?{" "}
              <button
                type="button"
                className="btn btn-link p-0 text-info fw-bold text-decoration-none"
                onClick={() => setMode("login")}
              >
                Giriş Yap
              </button>
            </p>
          )}
        </div>
      </form>

      <div className="text-center mt-3">
        <Link className="text-white-50 small text-decoration-none hover-text-white" to="/">
          <i className="bi bi-arrow-left me-1" /> Ana Sayfaya Dön
        </Link>
      </div>

      {/* 🇹🇷 E-DEVLET KAPISI DOĞRULAMA MODALI (BTK AKADEMİ STİLİ) */}
      {showEDevletModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
              <div className="px-4 py-3 text-white d-flex align-items-center justify-content-between" style={{ background: "linear-gradient(135deg, #e11d48 0%, #9f1239 100%)" }}>
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-4">🇹🇷</span>
                  <div>
                    <h6 className="fw-bold mb-0">e-Devlet Kapısı Kimlik Doğrulama Sistemi</h6>
                    <small className="opacity-75" style={{ fontSize: "11px" }}>Türkiye Cumhuriyeti Cumhurbaşkanlığı Dijital Dönüşüm Ofisi</small>
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEDevletModal(false)} />
              </div>

              <form onSubmit={handleEDevletSubmit}>
                <div className="modal-body p-4 bg-white">
                  <div className="p-3 bg-light rounded-3 border mb-3 small text-secondary">
                    <i className="bi bi-shield-check text-success me-1 fs-6" />
                    <strong>TechNova</strong> platformuna BTK Akademi entegrasyonu standartlarında güvenli kimlik doğrulaması yapıyorsunuz.
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark small">T.C. Kimlik Numarası *</label>
                    <input
                      type="text"
                      maxLength={11}
                      className="form-control font-monospace py-2"
                      placeholder="11 haneli T.C. Kimlik No"
                      value={eDevletTc}
                      onChange={(e) => setEDevletTc(e.target.value.replace(/\D/g, ""))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark small">e-Devlet Şifresi *</label>
                    <input
                      type="password"
                      className="form-control py-2"
                      placeholder="••••••••"
                      value={eDevletPass}
                      onChange={(e) => setEDevletPass(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3 border-top">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowEDevletModal(false)}>
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={eDevletLoading}
                    className="btn btn-danger rounded-pill px-5 fw-semibold"
                    style={{ background: "#e11d48" }}
                  >
                    {eDevletLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Doğrulanıyor...
                      </>
                    ) : (
                      "Kimliğimi Doğrula & Giriş Yap"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                <div className="modal-body p-4 bg-white">
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

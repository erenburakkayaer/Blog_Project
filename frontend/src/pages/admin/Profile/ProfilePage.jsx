import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { authService } from "../../../services/authService";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
];

export default function ProfilePage() {
  const { user, logout, freezeAccount, deleteAccount, logoutAllDevices } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Modals for Instagram-style account actions
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");

  // Güvenlik Hareketleri
  const [securityLogs, setSecurityLogs] = useState([]);

  useEffect(() => {
    setSecurityLogs(authService.getSecurityActivity());
  }, []);

  // Profile data
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("technova_admin_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      fullName: user?.fullName || "Samet Başkale",
      username: user?.userName || user?.name || "sametb",
      email: user?.email || "admin@technova.com",
      title: "Senior Full-Stack Developer & İçerik Üreticisi",
      bio: "TechNova platformunda modern web, mobil ve yapay zekâ teknolojileri üzerine rehberler ve açık kaynak projeler üretiyorum.",
      phone: "+90 (555) 123 45 67",
      location: "Yozgat / Bozok Teknopark",
      company: "Uslukılıç Yazılım",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      banner: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%)",
      skills: ["React 19", ".NET 10", "Node.js", "SQL Server", "Docker", "UI/UX"],
      github: "https://github.com/sametb",
      linkedin: "https://linkedin.com/in/sametb",
      twitter: "https://x.com/sametb",
      website: "https://technova.dev",
      bankName: "Ziraat Bankası",
      iban: "TR33 0001 0000 0000 1234 5678 90",
      accountHolder: "Samet Başkale",
      isEDevletConnected: true,
      isGoogleConnected: true,
      isGithubConnected: true,
    };
  });

  const [newSkill, setNewSkill] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      localStorage.setItem("technova_admin_profile", JSON.stringify(profile));
      window.dispatchEvent(new Event("adminProfileUpdated"));
      setIsSaving(false);
      toast.success("🎉 Profil bilgileriniz başarıyla güncellendi!");
    }, 400);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((p) => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setProfile((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error("Yeni şifreler birbiriyle uyuşmuyor!");
      return;
    }
    if (passwordForm.newPass.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    authService.recordSecurityActivity({
      email: profile.email,
      action: "Şifre Güncellendi",
      device: "Windows PC / Chrome",
      ip: "192.168.1.45",
      status: "Başarılı",
      date: new Date().toISOString(),
    });
    setSecurityLogs(authService.getSecurityActivity());

    toast.success("🔐 Şifreniz başarıyla güncellendi.");
    setPasswordForm({ current: "", newPass: "", confirm: "" });
  };

  const handleCustomAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((p) => ({ ...p, avatar: url }));
      toast.success("Görsel seçildi. Kaydetmeyi unutmayın.");
    }
  };

  // Hesabı Dondur
  const handleFreezeAccountSubmit = async () => {
    try {
      await freezeAccount();
      toast.success("❄️ Hesabınız geçici olarak donduruldu. Giriş sayfasına yönlendiriliyorsunuz.");
      navigate("/giris", { replace: true });
    } catch {
      toast.error("İşlem sırasında bir hata oluştu.");
    }
  };

  // Hesabı Sil
  const handleDeleteAccountSubmit = async () => {
    if (confirmDeleteText !== "HESABIMI SIL") {
      toast.error("Lütfen onaylamak için kutucuğa 'HESABIMI SIL' yazınız.");
      return;
    }
    try {
      await deleteAccount();
      toast.success("🗑️ Hesabınız ve tüm verileriniz kalıcı olarak silindi.");
      navigate("/giris", { replace: true });
    } catch {
      toast.error("Hesap silinirken bir hata oluştu.");
    }
  };

  // Tüm Cihazlardan Çıkış
  const handleLogoutAllDevices = async () => {
    await logoutAllDevices();
    toast.success("🚪 Tüm cihazlardaki oturumlar kapatıldı.");
    navigate("/giris", { replace: true });
  };

  return (
    <div className="pb-5">
      {/* 1. INSTAGRAM / UDEMY STYLE CREATOR BANNER */}
      <div
        className="rounded-4 p-4 p-md-5 mb-4 text-white position-relative overflow-hidden shadow-sm"
        style={{ background: profile.banner }}
      >
        <div
          className="position-absolute end-0 top-0 bottom-0 opacity-25 d-none d-md-block"
          style={{ width: "40%", background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }}
        />

        <div className="d-flex flex-column flex-md-row align-items-center gap-4 position-relative z-1">
          {/* Avatar with Status Ring */}
          <div className="position-relative">
            <img
              src={profile.avatar}
              alt={profile.fullName}
              className="rounded-circle border border-4 border-white shadow-lg object-fit-cover"
              style={{ width: "110px", height: "110px" }}
            />
            <span
              className="position-absolute bottom-0 end-0 p-2 bg-success border border-2 border-white rounded-circle"
              title="Aktif Durumda"
            />
          </div>

          <div className="text-center text-md-start flex-grow-1">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <h1 className="h3 fw-bold mb-0 text-white">{profile.fullName}</h1>
              <span className="badge bg-primary bg-opacity-75 border border-white border-opacity-25 rounded-pill px-3 py-1 text-uppercase small">
                {user?.role || "Yazar & Geliştirici"}
              </span>
              <span className="badge bg-danger rounded-pill px-2 py-1 small">
                🇹🇷 e-Devlet Onaylı
              </span>
            </div>

            <p className="text-white-50 small mb-3">
              @{profile.username} • {profile.title}
            </p>

            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-3 small text-white-50">
              <span><i className="bi bi-geo-alt me-1 text-warning" />{profile.location}</span>
              <span><i className="bi bi-building me-1 text-info" />{profile.company}</span>
              <span><i className="bi bi-envelope me-1 text-primary" />{profile.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABBED SETTINGS CARD */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="card-header bg-white border-bottom p-0">
          <ul className="nav nav-tabs border-0 px-3 pt-2 gap-2" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link border-0 py-3 px-3 fw-semibold ${activeTab === "profile" ? "active text-primary border-bottom border-primary border-3" : "text-secondary"}`}
                onClick={() => setActiveTab("profile")}
              >
                <i className="bi bi-person-lines-fill me-2" />
                Profil & Biyografi
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 py-3 px-3 fw-semibold ${activeTab === "skills" ? "active text-primary border-bottom border-primary border-3" : "text-secondary"}`}
                onClick={() => setActiveTab("skills")}
              >
                <i className="bi bi-code-slash me-2" />
                Yetenekler & Sosyal Medya
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 py-3 px-3 fw-semibold ${activeTab === "payout" ? "active text-primary border-bottom border-primary border-3" : "text-secondary"}`}
                onClick={() => setActiveTab("payout")}
              >
                <i className="bi bi-cash-stack me-2" />
                Ödeme & IBAN Bilgileri
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 py-3 px-3 fw-semibold ${activeTab === "security" ? "active text-primary border-bottom border-primary border-3" : "text-secondary"}`}
                onClick={() => setActiveTab("security")}
              >
                <i className="bi bi-shield-lock me-2" />
                Güvenlik & Şifre
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 py-3 px-3 fw-semibold ${activeTab === "accountCenter" ? "active text-danger border-bottom border-danger border-3" : "text-secondary"}`}
                onClick={() => setActiveTab("accountCenter")}
              >
                <i className="bi bi-gear-wide-connected me-2 text-danger" />
                Hesap & Hareketler (Instagram Stili)
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Contents */}
        <div className="card-body p-4 p-md-5">
          {/* TAB 1: PROFİL BİLGİLERİ */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile}>
              <h2 className="h5 fw-bold mb-4 text-dark">Kişisel Bilgiler ve Görsel</h2>

              {/* Avatar Seçici */}
              <div className="mb-4 p-3 bg-light rounded-4 border">
                <label className="form-label fw-bold text-dark small mb-2 d-block">
                  Profil Fotoğrafı Seçin veya Yükleyin
                </label>
                <div className="d-flex flex-wrap align-items-center gap-3">
                  {PRESET_AVATARS.map((av, index) => (
                    <img
                      key={index}
                      src={av}
                      alt="Preset"
                      className={`rounded-circle cursor-pointer border-3 ${profile.avatar === av ? "border border-primary shadow-sm" : "opacity-75"}`}
                      style={{ width: "48px", height: "48px", cursor: "pointer", transition: "transform 0.2s" }}
                      onClick={() => setProfile((p) => ({ ...p, avatar: av }))}
                    />
                  ))}
                  <label className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 cursor-pointer">
                    <i className="bi bi-upload me-1" /> Kendi Görselini Yükle
                    <input type="file" accept="image/*" className="d-none" onChange={handleCustomAvatarUpload} />
                  </label>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Ad Soyad</label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Kullanıcı Adı</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-secondary">@</span>
                    <input
                      type="text"
                      className="form-control rounded-end-3 py-2"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">E-posta Adresi</label>
                  <input
                    type="email"
                    className="form-control rounded-3 py-2"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Telefon Numarası</label>
                  <input
                    type="tel"
                    className="form-control rounded-3 py-2"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Mesleki Ünvan</label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    placeholder="Örn: Senior Frontend Developer"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Konum / Şehir</label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">Biyografi (Hakkımda)</label>
                  <textarea
                    rows={4}
                    className="form-control rounded-3"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Kendinizi, ilgi alanlarınızı ve uzmanlıklarınızı anlatın..."
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary px-5 py-2 fw-semibold rounded-pill shadow-sm"
                >
                  {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: YETENEKLER & SOSYAL MEDYA */}
          {activeTab === "skills" && (
            <form onSubmit={handleSaveProfile}>
              <h2 className="h5 fw-bold mb-4 text-dark">Yetenekler ve Sosyal Bağlantılar</h2>

              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small">Yetenekler & Teknolojiler</label>
                <div className="d-flex gap-2 mb-3">
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="Yeni teknoloji ekle (örn: TypeScript, Docker)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }}
                  />
                  <button type="button" className="btn btn-dark rounded-3 px-4" onClick={handleAddSkill}>
                    Ekle
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="badge bg-light text-dark border p-2 px-3 rounded-pill fw-medium d-inline-flex align-items-center gap-2">
                      {skill}
                      <button type="button" className="btn-close" style={{ width: "8px", height: "8px" }} onClick={() => handleRemoveSkill(skill)} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small"><i className="bi bi-github me-1 text-dark" /> GitHub Profili</label>
                  <input type="url" className="form-control rounded-3" value={profile.github} onChange={(e) => setProfile({ ...profile, github: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small"><i className="bi bi-linkedin me-1 text-primary" /> LinkedIn</label>
                  <input type="url" className="form-control rounded-3" value={profile.linkedin} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" disabled={isSaving} className="btn btn-primary px-5 py-2 fw-semibold rounded-pill shadow-sm">
                  {isSaving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ÖDEME & IBAN */}
          {activeTab === "payout" && (
            <form onSubmit={handleSaveProfile}>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h2 className="h5 fw-bold mb-1 text-dark">Yazar Kazanç & Ödeme Ayarları</h2>
                  <p className="text-secondary small mb-0">Okunma başına biriken gelirleriniz bu hesaba aktarılır.</p>
                </div>
                <div className="badge bg-success bg-opacity-10 text-success p-2 px-3 rounded-pill fw-bold">
                  Bakiye: ₺1.450,00
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Banka Adı</label>
                  <input type="text" className="form-control rounded-3 py-2" value={profile.bankName} onChange={(e) => setProfile({ ...profile, bankName: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Hesap Sahibi Ad Soyad</label>
                  <input type="text" className="form-control rounded-3 py-2" value={profile.accountHolder} onChange={(e) => setProfile({ ...profile, accountHolder: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">IBAN Numarası</label>
                  <input type="text" className="form-control rounded-3 py-2 fw-semibold font-monospace" value={profile.iban} onChange={(e) => setProfile({ ...profile, iban: e.target.value })} required />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" disabled={isSaving} className="btn btn-primary px-5 py-2 fw-semibold rounded-pill shadow-sm">
                  {isSaving ? "Kaydediliyor..." : "IBAN Bilgilerini Güncelle"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: GÜVENLİK & ŞİFRE */}
          {activeTab === "security" && (
            <form onSubmit={handlePasswordChange}>
              <h2 className="h5 fw-bold mb-4 text-dark">Şifre Değiştirme</h2>

              <div className="row g-3 mb-4" style={{ maxWidth: "500px" }}>
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">Mevcut Şifre</label>
                  <input type="password" className="form-control rounded-3 py-2" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">Yeni Şifre</label>
                  <input type="password" className="form-control rounded-3 py-2" value={passwordForm.newPass} onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })} required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">Yeni Şifre (Tekrar)</label>
                  <input type="password" className="form-control rounded-3 py-2" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary px-5 py-2 fw-semibold rounded-pill shadow-sm">
                Şifreyi Güncelle
              </button>
            </form>
          )}

          {/* TAB 5: INSTAGRAM STYLE HESAP MERKEZİ & HAREKETLER */}
          {activeTab === "accountCenter" && (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h2 className="h5 fw-bold mb-1 text-dark">
                    <i className="bi bi-shield-shaded text-danger me-2" />
                    Hesap Yönetimi, Güvenlik & Hareketler
                  </h2>
                  <p className="text-secondary small mb-0">
                    Instagram & BTK Akademi standartlarında oturumlarınızı, bağlı kimliklerinizi ve hesap durumunuzu yönetin.
                  </p>
                </div>
              </div>

              {/* 1. BAĞLI HESAPLAR & KİMLİK DOĞRULAMA */}
              <div className="card border rounded-4 p-4 mb-4 bg-light bg-opacity-50">
                <h6 className="fw-bold mb-3 text-dark">
                  <i className="bi bi-person-check-fill text-primary me-2" />
                  Doğrulanmış Hesaplar & Kimlik Sağlayıcılar
                </h6>

                <div className="d-flex flex-column gap-3">
                  {/* e-Devlet */}
                  <div className="d-flex align-items-center justify-content-between p-3 bg-white rounded-3 border">
                    <div className="d-flex align-items-center gap-3">
                      <span className="fs-3">🇹🇷</span>
                      <div>
                        <div className="fw-bold text-dark">e-Devlet Kapısı Kimlik Doğrulaması</div>
                        <small className="text-success fw-semibold"><i className="bi bi-check-circle-fill me-1" /> T.C. Kimlik Onaylı Hesap</small>
                      </div>
                    </div>
                    <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">Doğrulandı</span>
                  </div>

                  {/* Google */}
                  <div className="d-flex align-items-center justify-content-between p-3 bg-white rounded-3 border">
                    <div className="d-flex align-items-center gap-3">
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <div>
                        <div className="fw-bold text-dark">Google Hesabı</div>
                        <small className="text-secondary">{profile.email}</small>
                      </div>
                    </div>
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">Bağlı</span>
                  </div>

                  {/* GitHub */}
                  <div className="d-flex align-items-center justify-content-between p-3 bg-white rounded-3 border">
                    <div className="d-flex align-items-center gap-3">
                      <i className="bi bi-github fs-3 text-dark" />
                      <div>
                        <div className="fw-bold text-dark">GitHub Geliştirici Hesabı</div>
                        <small className="text-secondary">{profile.github}</small>
                      </div>
                    </div>
                    <span className="badge bg-dark bg-opacity-10 text-dark px-3 py-2 rounded-pill">Bağlı</span>
                  </div>
                </div>
              </div>

              {/* 2. GİRİŞ HAREKETLERİ (INSTAGRAM GÜVENLİK GEÇMİŞİ) */}
              <div className="card border rounded-4 p-4 mb-4 bg-light bg-opacity-50">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-activity text-info me-2" />
                    Giriş Hareketleri & Güvenlik Kayıtları
                  </h6>
                  <button type="button" className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={handleLogoutAllDevices}>
                    <i className="bi bi-box-arrow-right me-1" /> Tüm Cihazlardan Çıkış Yap
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover bg-white rounded-3 overflow-hidden align-middle mb-0">
                    <thead className="table-light">
                      <tr className="small text-secondary">
                        <th>İşlem / Hareket</th>
                        <th>Cihaz & Tarayıcı</th>
                        <th>IP Adresi</th>
                        <th>Tarih</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {securityLogs.map((log, idx) => (
                        <tr key={idx}>
                          <td className="fw-semibold text-dark">{log.action}</td>
                          <td className="text-secondary">{log.device}</td>
                          <td className="text-secondary font-monospace">{log.ip}</td>
                          <td className="text-secondary">{new Date(log.date).toLocaleString("tr-TR")}</td>
                          <td><span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2">{log.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. HESAP YAŞAM DÖNGÜSÜ (DONDUR / SİL) */}
              <div className="card border border-danger border-opacity-25 rounded-4 p-4 bg-danger bg-opacity-10">
                <h6 className="fw-bold text-danger mb-2">
                  <i className="bi bi-exclamation-triangle-fill me-2" />
                  Tehlikeli Bölge (Hesap Durumu & Silme)
                </h6>
                <p className="small text-secondary mb-4">
                  Hesabınızı dondurabilir veya tamamen sistemden kaldırabilirsiniz.
                </p>

                <div className="d-flex flex-wrap gap-3">
                  <button type="button" className="btn btn-warning fw-semibold px-4 rounded-pill" onClick={() => setShowFreezeModal(true)}>
                    <i className="bi bi-pause-circle me-1" /> Hesabı Geçici Olarak Dondur
                  </button>
                  <button type="button" className="btn btn-danger fw-semibold px-4 rounded-pill" onClick={() => setShowDeleteModal(true)}>
                    <i className="bi bi-trash3 me-1" /> Hesabı Kalıcı Olarak Sil
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DONDURMA MODALI */}
      {showFreezeModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-warning bg-opacity-10 border-bottom">
                <h5 className="modal-title fw-bold text-warning-emphasis fs-6">
                  <i className="bi bi-pause-circle-fill me-2" />
                  Hesabınızı Dondurmak Üzeresiniz
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowFreezeModal(false)} />
              </div>
              <div className="modal-body p-4">
                <p className="small text-secondary mb-0">
                  Hesabınızı dondurduğunuzda profiliniz ve içerikleriniz gizlenir. İstediğiniz zaman e-posta ve şifrenizle giriş yaparak hesabınızı anında tekrar etkinleştirebilirsiniz.
                </p>
              </div>
              <div className="modal-footer bg-light border-top">
                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowFreezeModal(false)}>İptal</button>
                <button type="button" className="btn btn-warning rounded-pill px-4 fw-semibold" onClick={handleFreezeAccountSubmit}>Hesabımı Dondur</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SILME MODALI */}
      {showDeleteModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold fs-6">
                  <i className="bi bi-exclamation-octagon-fill me-2" />
                  Hesabı Kalıcı Olarak Sil
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)} />
              </div>
              <div className="modal-body p-4">
                <p className="text-danger fw-semibold small mb-2">
                  ⚠️ Bu işlem geri alınamaz! Tüm bloglarınız, projeleriniz ve bakiye kayıtlarınız kalıcı olarak silinecektir.
                </p>
                <p className="small text-secondary mb-3">
                  Onaylamak için lütfen aşağıdaki kutuya büyük harflerle <strong>HESABIMI SIL</strong> yazınız:
                </p>
                <input
                  type="text"
                  className="form-control font-monospace border-danger py-2"
                  placeholder="HESABIMI SIL"
                  value={confirmDeleteText}
                  onChange={(e) => setConfirmDeleteText(e.target.value)}
                />
              </div>
              <div className="modal-footer bg-light border-top">
                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowDeleteModal(false)}>İptal</button>
                <button type="button" className="btn btn-danger rounded-pill px-4 fw-semibold" onClick={handleDeleteAccountSubmit}>Kalıcı Olarak Sil</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

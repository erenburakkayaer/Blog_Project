import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200",
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

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
      username: user?.userName || "sametb",
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
              className="rounded-circle shadow-lg border border-3 border-white object-fit-cover"
              style={{ width: "110px", height: "110px" }}
            />
            <span
              className="position-absolute bottom-0 end-0 p-2 bg-success border border-2 border-white rounded-circle"
              title="Çevrimiçi"
            />
          </div>

          {/* User Headline */}
          <div className="text-center text-md-start flex-grow-1">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <h1 className="h3 fw-bold mb-0 text-white">{profile.fullName}</h1>
              <span className="badge bg-primary bg-opacity-75 rounded-pill px-3 py-1 text-white small">
                @{profile.username}
              </span>
              <span className="badge bg-warning text-dark rounded-pill px-2 py-1 small fw-bold">
                <i className="bi bi-patch-check-fill text-primary me-1" /> Onaylı İçerik Üreticisi
              </span>
            </div>
            <p className="text-white-50 mb-2">{profile.title}</p>
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 small text-white-50">
              <span><i className="bi bi-geo-alt me-1 text-info" />{profile.location}</span>
              <span><i className="bi bi-building me-1 text-info" />{profile.company}</span>
              <span><i className="bi bi-envelope me-1 text-info" />{profile.email}</span>
            </div>
          </div>

          {/* Quick Stats Box (Udemy Creator Stats) */}
          <div className="d-flex gap-2 text-center bg-black bg-opacity-25 rounded-4 p-3 border border-white border-opacity-10">
            <div className="px-3 border-end border-white border-opacity-10">
              <div className="h4 fw-bold mb-0 text-white">4</div>
              <small className="text-white-50" style={{ fontSize: "11px" }}>Bloglar</small>
            </div>
            <div className="px-3 border-end border-white border-opacity-10">
              <div className="h4 fw-bold mb-0 text-info">4</div>
              <small className="text-white-50" style={{ fontSize: "11px" }}>Projeler</small>
            </div>
            <div className="px-3">
              <div className="h4 fw-bold mb-0 text-warning">₺1.450</div>
              <small className="text-white-50" style={{ fontSize: "11px" }}>Bakiye</small>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABBED MANAGEMENT INTERFACE */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="card-header bg-white border-bottom p-0">
          <ul className="nav nav-tabs border-0 px-3 pt-2 gap-2" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link border-0 py-3 px-4 fw-semibold ${activeTab === "profile" ? "active text-primary border-bottom border-primary border-3" : "text-secondary"}`}
                onClick={() => setActiveTab("profile")}
              >
                <i className="bi bi-person-lines-fill me-2" />
                Profil & Biyografi
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 py-3 px-4 fw-semibold ${activeTab === "skills" ? "active text-primary border-bottom border-primary border-3" : "text-secondary"}`}
                onClick={() => setActiveTab("skills")}
              >
                <i className="bi bi-code-slash me-2" />
                Yetenekler & Sosyal Medya
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 py-3 px-4 fw-semibold ${activeTab === "payout" ? "active text-primary border-bottom border-primary border-3" : "text-secondary"}`}
                onClick={() => setActiveTab("payout")}
              >
                <i className="bi bi-cash-stack me-2" />
                Ödeme & IBAN Bilgileri
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 py-3 px-4 fw-semibold ${activeTab === "security" ? "active text-primary border-bottom border-primary border-3" : "text-secondary"}`}
                onClick={() => setActiveTab("security")}
              >
                <i className="bi bi-shield-lock me-2" />
                Güvenlik & Şifre
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
                    <span className="input-group-text bg-light rounded-start-3">@</span>
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
                  <label className="form-label fw-semibold text-secondary small">E-Posta Adresi</label>
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
                  <label className="form-label fw-semibold text-secondary small">Mesleki Unvan</label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    placeholder="Örn: Senior Frontend Developer"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Şirket / Kurum</label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">Hakkımda / Biyografi</label>
                  <textarea
                    rows={4}
                    className="form-control rounded-3"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Kısa profesyonel özetiniz..."
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
              <h2 className="h5 fw-bold mb-4 text-dark">Uzmanlık Alanları & Sosyal Ağlar</h2>

              {/* Skills Tag Management */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small">Uzmanlık & Teknolojiler</label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="badge bg-light text-dark border px-3 py-2 rounded-pill d-flex align-items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        className="btn-close"
                        style={{ fontSize: "10px" }}
                        onClick={() => handleRemoveSkill(skill)}
                      />
                    </span>
                  ))}
                </div>
                <div className="input-group" style={{ maxWidth: "400px" }}>
                  <input
                    type="text"
                    className="form-control rounded-start-3"
                    placeholder="Yeni teknoloji ekle (örn: Next.js)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary rounded-end-3"
                    onClick={handleAddSkill}
                  >
                    Ekle
                  </button>
                </div>
              </div>

              <hr className="my-4" />

              {/* Social Links */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">
                    <i className="bi bi-github me-1" /> GitHub
                  </label>
                  <input
                    type="url"
                    className="form-control rounded-3"
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">
                    <i className="bi bi-linkedin me-1 text-primary" /> LinkedIn
                  </label>
                  <input
                    type="url"
                    className="form-control rounded-3"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">
                    <i className="bi bi-twitter-x me-1 text-dark" /> Twitter / X
                  </label>
                  <input
                    type="url"
                    className="form-control rounded-3"
                    value={profile.twitter}
                    onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">
                    <i className="bi bi-globe me-1 text-success" /> Kişisel Web Sitesi
                  </label>
                  <input
                    type="url"
                    className="form-control rounded-3"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary px-5 py-2 fw-semibold rounded-pill shadow-sm"
                >
                  {isSaving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ÖDEME & IBAN BİLGİLERİ */}
          {activeTab === "payout" && (
            <form onSubmit={handleSaveProfile}>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h2 className="h5 fw-bold mb-1 text-dark">Yazar Kazanç & Ödeme Ayarları</h2>
                  <p className="text-secondary small mb-0">
                    Okunma başına biriken gelirleriniz bu hesaba aktarılır.
                  </p>
                </div>
                <div className="badge bg-success bg-opacity-10 text-success p-2 px-3 rounded-pill fw-bold">
                  Bakiye: ₺1.450,00
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Banka Adı</label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2"
                    value={profile.bankName}
                    onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                    placeholder="Örn: Ziraat Bankası, Garanti BBVA"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Hesap Sahibi Ad Soyad</label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2"
                    value={profile.accountHolder}
                    onChange={(e) => setProfile({ ...profile, accountHolder: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">IBAN Numarası</label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2 fw-semibold font-monospace"
                    value={profile.iban}
                    onChange={(e) => setProfile({ ...profile, iban: e.target.value })}
                    placeholder="TR__ ____ ____ ____ ____ ____ __"
                    required
                  />
                  <div className="form-text">
                    <i className="bi bi-shield-check text-success me-1" /> Ödemeler her ayın 1'inde otomatik veya manuel taleple gerçekleştirilir.
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary px-5 py-2 fw-semibold rounded-pill shadow-sm"
                >
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
                  <input
                    type="password"
                    className="form-control rounded-3 py-2"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">Yeni Şifre</label>
                  <input
                    type="password"
                    className="form-control rounded-3 py-2"
                    value={passwordForm.newPass}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary small">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    className="form-control rounded-3 py-2"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary px-5 py-2 fw-semibold rounded-pill shadow-sm">
                Şifreyi Güncelle
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

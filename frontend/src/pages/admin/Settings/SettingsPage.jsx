// src/pages/admin/Settings/SettingsPage.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../../components/ui/PageHeader";
import useSite from "../../../hooks/useSite";
import useAuth from "../../../hooks/useAuth";

export default function SettingsPage() {
  const { settings, updateSettings } = useSite();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === "admin";

  // Genel Site Ayarları State'i (Context'ten gelen güncel veriyi baz alır)
  const [generalSettings, setGeneralSettings] = useState(settings);

  // Sosyal Medya State'i
  const [socialSettings, setSocialSettings] = useState({
    instagram: "https://instagram.com/technova",
    twitter: "https://twitter.com/technova",
    linkedin: "https://linkedin.com/company/technova",
    github: "https://github.com/technova",
    youtube: "https://youtube.com/@technova",
  });

  // Ödeme Yöntemleri State'i
  const [paymentSettings, setPaymentSettings] = useState({
    enableCreditCard: true,
    enableBankTransfer: true,
    provider: "iyzico",
    apiKey: "test_apiKey_123456",
    iban: "TR33 0001 0000 0000 1234 5678 90",
  });

  // Hesap & Profil State'i (Önceden kaydedilmiş varsa localStorage'dan alır)
  const [profileSettings, setProfileSettings] = useState(() => {
    const saved = localStorage.getItem("technova_admin_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      username: "Yönetici",
      adminEmail: "admin@technova.com",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    };
  });

  // Güvenlik & Şifre State'i
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: true,
    maintenanceMode: false,
  });

  const handleSave = (e, sectionName) => {
    e.preventDefault();

    if (!isAdmin) {
      toast.error("Bu alanı sadece Yönetici (Admin) değiştirebilir!");
      return;
    }

    setIsSubmitting(true);

    // Genel Ayarlar kaydediliyorsa SiteContext üzerinden güncelle
    if (sectionName === "Genel Ayarlar") {
      updateSettings(generalSettings);
    }

    // Eğer Profil Ayarları kaydediliyorsa localStorage'a yaz ve Header'ı tetikle
    if (sectionName === "Profil Ayarları") {
      localStorage.setItem(
        "technova_admin_profile",
        JSON.stringify(profileSettings),
      );
      window.dispatchEvent(new Event("adminProfileUpdated"));
    }

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`${sectionName} başarıyla güncellendi.`);
    }, 600);
  };

  // Bilgisayardan dosya seçildiğinde otomatik Base64'e çevirip kusursuz ölçeklendirme yapma
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Görsel boyutu en fazla 2 MB olmalıdır.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileSettings((prev) => ({ ...prev, avatar: reader.result }));
      toast.success("Profil fotoğrafı yüklendi.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container-fluid px-4 py-4">
      <PageHeader
        title="Sistem Ayarları"
        description="Web sitesi genel yapılandırmalarını, sosyal medya hesaplarını, ödeme yöntemlerini ve yönetici güvenliğini yönetin."
      />

      {/* Sekmeler (Tabs) */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills gap-2 bg-white p-2 rounded shadow-sm border flex-wrap">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link px-3 py-2 fw-medium ${activeTab === "general" ? "active bg-dark text-white" : "text-dark"}`}
                onClick={() => setActiveTab("general")}
              >
                <i className="bi bi-gear me-2" /> Genel Ayarlar
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link px-3 py-2 fw-medium ${activeTab === "social" ? "active bg-dark text-white" : "text-dark"}`}
                onClick={() => setActiveTab("social")}
              >
                <i className="bi bi-share me-2" /> Sosyal Medya
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link px-3 py-2 fw-medium ${activeTab === "payment" ? "active bg-dark text-white" : "text-dark"}`}
                onClick={() => setActiveTab("payment")}
              >
                <i className="bi bi-credit-card me-2" /> Ödeme Yöntemleri
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link px-3 py-2 fw-medium ${activeTab === "profile" ? "active bg-dark text-white" : "text-dark"}`}
                onClick={() => setActiveTab("profile")}
              >
                <i className="bi bi-person-circle me-2" /> Hesap & Profil
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link px-3 py-2 fw-medium ${activeTab === "security" ? "active bg-dark text-white" : "text-dark"}`}
                onClick={() => setActiveTab("security")}
              >
                <i className="bi bi-shield-lock me-2" /> Güvenlik & Şifre
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* 1. GENEL AYARLAR */}
      {activeTab === "general" && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold">Genel Site Yapılandırması</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={(e) => handleSave(e, "Genel Ayarlar")}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Site Adı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={generalSettings.siteName}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        siteName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    İletişim E-Posta
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={generalSettings.email}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium">Site Sloganı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={generalSettings.slogan}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        slogan: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Destek / İletişim Telefonu
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={generalSettings.phone}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Telif Metni (Copyright)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={generalSettings.copyright}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        copyright: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mt-4 text-end">
                <button
                  type="submit"
                  className="btn btn-dark px-4"
                  disabled={isSubmitting || !isAdmin}
                >
                  {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. SOSYAL MEDYA */}
      {activeTab === "social" && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold">Sosyal Medya Hesapları</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={(e) => handleSave(e, "Sosyal Medya Ayarları")}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    <i className="bi bi-instagram text-danger me-2" /> Instagram
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={socialSettings.instagram}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setSocialSettings({
                        ...socialSettings,
                        instagram: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    <i className="bi bi-twitter-x text-dark me-2" /> Twitter (X)
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={socialSettings.twitter}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setSocialSettings({
                        ...socialSettings,
                        twitter: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    <i className="bi bi-linkedin text-primary me-2" /> LinkedIn
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={socialSettings.linkedin}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setSocialSettings({
                        ...socialSettings,
                        linkedin: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    <i className="bi bi-github me-2" /> GitHub
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={socialSettings.github}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setSocialSettings({
                        ...socialSettings,
                        github: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label fw-medium">
                    <i className="bi bi-youtube text-danger me-2" /> YouTube
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={socialSettings.youtube}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setSocialSettings({
                        ...socialSettings,
                        youtube: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mt-4 text-end">
                <button
                  type="submit"
                  className="btn btn-dark px-4"
                  disabled={isSubmitting || !isAdmin}
                >
                  {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ÖDEME YÖNTEMLERİ */}
      {activeTab === "payment" && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold">
              Ödeme Yöntemleri ve Finansal Entegrasyonlar
            </h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={(e) => handleSave(e, "Ödeme Ayarları")}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Ödeme Sağlayıcı
                  </label>
                  <select
                    className="form-select"
                    value={paymentSettings.provider}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        provider: e.target.value,
                      })
                    }
                  >
                    <option value="iyzico">iyzico</option>
                    <option value="stripe">Stripe</option>
                    <option value="paytr">PayTR</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    API Anahtarı (API Key)
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={paymentSettings.apiKey}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        apiKey: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium">
                    Havale / EFT için IBAN Numarası
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentSettings.iban}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setPaymentSettings({
                        ...paymentSettings,
                        iban: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-12 mt-3">
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="ccCheck"
                      checked={paymentSettings.enableCreditCard}
                      disabled={!isAdmin}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          enableCreditCard: e.target.checked,
                        })
                      }
                    />
                    <label
                      className="form-check-label fw-medium"
                      htmlFor="ccCheck"
                    >
                      Kredi Kartı ile Ödeme Aktif
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="eftCheck"
                      checked={paymentSettings.enableBankTransfer}
                      disabled={!isAdmin}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          enableBankTransfer: e.target.checked,
                        })
                      }
                    />
                    <label
                      className="form-check-label fw-medium"
                      htmlFor="eftCheck"
                    >
                      Banka Havalesi / EFT ile Ödeme Aktif
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-end">
                <button
                  type="submit"
                  className="btn btn-dark px-4"
                  disabled={isSubmitting || !isAdmin}
                >
                  {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. HESAP & PROFİL */}
      {activeTab === "profile" && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold">Yönetici Hesap ve Profil Ayarları</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={(e) => handleSave(e, "Profil Ayarları")}>
              {/* GitHub / Instagram Standardında Daire Profil Fotoğrafı ve Yükleme Alanı */}
              <div className="d-flex flex-column flex-sm-row align-items-center gap-4 mb-4 pb-4 border-bottom">
                <div className="position-relative">
                  <img
                    src={profileSettings.avatar}
                    alt="Profil"
                    className="rounded-circle shadow border object-fit-cover"
                    style={{ width: "110px", height: "110px" }}
                  />
                </div>
                <div className="flex-grow-1 text-center text-sm-start">
                  <label className="form-label fw-semibold mb-1">
                    Profil Fotoğrafı
                  </label>
                  <p className="text-muted small mb-3">
                    Bilgisayarınızdan bir görsel seçin (PNG, JPG veya WEBP).
                  </p>
                  <div className="d-flex flex-wrap justify-content-center justify-content-sm-start gap-2">
                    {isAdmin && (
                      <label className="btn btn-sm btn-dark cursor-pointer mb-0">
                        <i className="bi bi-upload me-2" /> Bilgisayardan Seç
                        <input
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                    {profileSettings.avatar && isAdmin && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          setProfileSettings({
                            ...profileSettings,
                            avatar: "",
                          })
                        }
                      >
                        <i className="bi bi-trash me-1" /> Kaldır
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium">Kullanıcı Adı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileSettings.username}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setProfileSettings({
                        ...profileSettings,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Yönetici E-Posta
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={profileSettings.adminEmail}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setProfileSettings({
                        ...profileSettings,
                        adminEmail: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mt-4 text-end">
                <button
                  type="submit"
                  className="btn btn-dark px-4"
                  disabled={isSubmitting || !isAdmin}
                >
                  {isSubmitting ? "Kaydediliyor..." : "Profili Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. GÜVENLİK & ŞİFRE */}
      {activeTab === "security" && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold">Güvenlik, Şifre ve Sistem Modu</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={(e) => handleSave(e, "Güvenlik Ayarları")}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-medium">Mevcut Şifre</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={securitySettings.currentPassword}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">Yeni Şifre</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={securitySettings.newPassword}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={securitySettings.confirmPassword}
                    disabled={!isAdmin}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <hr className="my-4" />

                <div className="col-12">
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="tfaCheck"
                      checked={securitySettings.twoFactorAuth}
                      disabled={!isAdmin}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          twoFactorAuth: e.target.checked,
                        })
                      }
                    />
                    <label
                      className="form-check-label fw-medium"
                      htmlFor="tfaCheck"
                    >
                      İki Aşamalı Doğrulama (2FA) Etkinleştir
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input bg-danger border-danger"
                      type="checkbox"
                      id="maintCheck"
                      checked={securitySettings.maintenanceMode}
                      disabled={!isAdmin}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          maintenanceMode: e.target.checked,
                        })
                      }
                    />
                    <label
                      className="form-check-label fw-medium text-danger"
                      htmlFor="maintCheck"
                    >
                      Bakım Modu (Siteyi ziyaretçilere kapat)
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-end">
                <button
                  type="submit"
                  className="btn btn-dark px-4"
                  disabled={isSubmitting || !isAdmin}
                >
                  {isSubmitting
                    ? "Güncelleniyor..."
                    : "Güvenlik Ayarlarını Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { offerService } from "../../../services/offerService";

const steps = [
  {
    label: "Proje Türü",
    icon: "bi-grid-1x2",
    options: [
      { value: "web", label: "Web Yazılım", icon: "bi-code-slash" },
      { value: "mobile", label: "Mobil Uygulama", icon: "bi-phone" },
      { value: "ai", label: "Yapay Zekâ", icon: "bi-cpu" },
      { value: "security", label: "Siber Güvenlik", icon: "bi-shield-check" },
      { value: "cloud", label: "Cloud & DevOps", icon: "bi-cloud" },
      { value: "design", label: "UI/UX Tasarım", icon: "bi-palette" },
    ],
  },
  {
    label: "Bütçe",
    icon: "bi-wallet2",
    options: [
      { value: "s", label: "10.000 – 25.000 ₺", icon: "bi-currency-dollar" },
      { value: "m", label: "25.000 – 75.000 ₺", icon: "bi-currency-dollar" },
      { value: "l", label: "75.000 – 150.000 ₺", icon: "bi-currency-dollar" },
      { value: "xl", label: "150.000 ₺ ve üzeri", icon: "bi-currency-dollar" },
    ],
  },
  {
    label: "İletişim",
    icon: "bi-person",
  },
];

function OfferPage() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({ type: "", budget: "" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [sent, setSent] = useState(false);

  const select = (key, val) => setSelections((p) => ({ ...p, [key]: val }));
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await offerService.create({
        contactName: form.name,
        contactEmail: form.email,
        contactPhone: form.phone,
        title: `${selections.type?.toUpperCase() || "Yazılım"} Projesi Teklif Talebi`,
        requirementDetails: `Bütçe Aralığı: ${selections.budget || "Belirtilmedi"} | Müşteri Notu: ${form.note || "Yok"}`,
      });
      setSent(true);
      toast.success("Teklif talebiniz başarıyla iletildi!");
    } catch {
      toast.error("Teklif iletilirken bir sorun oluştu.");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="site-hero" style={{ minHeight: "45vh" }}>
        <div className="site-hero__shape site-hero__shape--1" />
        <div className="site-hero__shape site-hero__shape--2" />
        <div className="container py-5" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div className="site-hero__badge mx-auto mb-3"><span className="site-hero__badge-dot" />Teklif Al</div>
          <h1 className="site-hero__title animate-fade-up" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            <span className="highlight">Özel teklif</span> alın
          </h1>
          <p className="site-hero__desc mx-auto animate-fade-up animate-delay-1">
            3 adımda ihtiyaçlarınızı belirtin, 24 saat içinde size özel fiyat teklifi gönderelim.
          </p>
          <nav aria-label="breadcrumb" className="animate-fade-up animate-delay-2">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/" style={{ color: "rgba(255,255,255,0.5)" }}>Ana Sayfa</Link></li>
              <li className="breadcrumb-item active" style={{ color: "#a5b4fc" }}>Teklif Al</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Wizard */}
      <section className="page-section section-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              {sent ? (
                <div className="surface-card p-5 text-center" style={{ borderRadius: 24 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "rgba(52,211,153,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1.5rem", fontSize: 32, color: "#34d399",
                  }}>
                    <i className="bi bi-check-lg" />
                  </div>
                  <h2 className="fw-bold mb-2">Talebiniz Alındı!</h2>
                  <p className="text-secondary mb-4">En geç 24 saat içinde size özel teklifimizi göndereceğiz.</p>
                  <button className="btn btn-primary px-5 fw-semibold" style={{ borderRadius: 12 }} onClick={() => { setSent(false); setStep(0); setSelections({ type: "", budget: "" }); }}>
                    Yeni Teklif Al
                  </button>
                </div>
              ) : (
                <div className="surface-card p-4 p-lg-5" style={{ borderRadius: 24 }}>
                  {/* Step indicator */}
                  <div className="offer-step-indicator">
                    {steps.map((s, i) => (
                      <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
                        <div className={`offer-step-dot${step === i ? " active" : i < step ? " done" : ""}`}>
                          {i < step ? <i className="bi bi-check-lg" /> : i + 1}
                        </div>
                        {i < steps.length - 1 && <div className={`offer-step-line${i < step ? " done" : ""}`} />}
                      </div>
                    ))}
                  </div>
                  <p className="text-secondary small mb-4">Adım {step + 1} / {steps.length} — {steps[step].label}</p>

                  {/* Step 1 - Type */}
                  {step === 0 && (
                    <>
                      <h2 className="h5 fw-bold mb-4">Hangi hizmete ihtiyacınız var?</h2>
                      <div className="row g-3">
                        {steps[0].options.map((opt) => (
                          <div key={opt.value} className="col-6 col-md-4">
                            <button
                              type="button"
                              onClick={() => select("type", opt.value)}
                              className="w-100 text-center p-3 fw-semibold"
                              style={{
                                border: `2px solid ${selections.type === opt.value ? "#6366f1" : "var(--color-border)"}`,
                                borderRadius: 14,
                                background: selections.type === opt.value ? "rgba(99,102,241,0.08)" : "transparent",
                                color: selections.type === opt.value ? "#6366f1" : "var(--color-text-muted)",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                fontSize: "0.87rem",
                              }}
                            >
                              <i className={`bi ${opt.icon} d-block mb-2`} style={{ fontSize: 22 }} />
                              {opt.label}
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 d-flex justify-content-end">
                        <button className="btn btn-primary px-5 fw-semibold" style={{ borderRadius: 12 }} disabled={!selections.type} onClick={() => setStep(1)}>
                          Devam <i className="bi bi-arrow-right ms-1" />
                        </button>
                      </div>
                    </>
                  )}

                  {/* Step 2 - Budget */}
                  {step === 1 && (
                    <>
                      <h2 className="h5 fw-bold mb-4">Bütçe aralığınız nedir?</h2>
                      <div className="d-flex flex-column gap-3">
                        {steps[1].options.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => select("budget", opt.value)}
                            className="d-flex align-items-center gap-3 p-3 fw-semibold text-start"
                            style={{
                              border: `2px solid ${selections.budget === opt.value ? "#6366f1" : "var(--color-border)"}`,
                              borderRadius: 14,
                              background: selections.budget === opt.value ? "rgba(99,102,241,0.08)" : "transparent",
                              color: selections.budget === opt.value ? "#6366f1" : "var(--color-text)",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            <div style={{
                              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                              background: selections.budget === opt.value ? "#6366f1" : "var(--color-border)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: selections.budget === opt.value ? "#fff" : "var(--color-text-muted)",
                              fontSize: 18,
                            }}>
                              <i className={`bi ${opt.icon}`} />
                            </div>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 d-flex gap-3 justify-content-end">
                        <button className="btn btn-outline-secondary px-4 fw-semibold" style={{ borderRadius: 12 }} onClick={() => setStep(0)}>
                          <i className="bi bi-arrow-left me-1" /> Geri
                        </button>
                        <button className="btn btn-primary px-5 fw-semibold" style={{ borderRadius: 12 }} disabled={!selections.budget} onClick={() => setStep(2)}>
                          Devam <i className="bi bi-arrow-right ms-1" />
                        </button>
                      </div>
                    </>
                  )}

                  {/* Step 3 - Contact */}
                  {step === 2 && (
                    <form onSubmit={handleSubmit}>
                      <h2 className="h5 fw-bold mb-4">İletişim bilgileriniz</h2>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold small">Ad Soyad *</label>
                          <input name="name" value={form.name} onChange={handleChange} type="text" className="form-control contact-input" placeholder="Ad Soyad" required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold small">E-posta *</label>
                          <input name="email" value={form.email} onChange={handleChange} type="email" className="form-control contact-input" placeholder="ornek@email.com" required />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold small">Telefon</label>
                          <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="form-control contact-input" placeholder="+90 5XX XXX XX XX" />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-semibold small">Projeniz hakkında kısa bilgi</label>
                          <textarea name="note" value={form.note} onChange={handleChange} className="form-control contact-input" rows={4} placeholder="Proje detayları, hedefler, zaman çizelgesi…" />
                        </div>
                      </div>
                      <div className="mt-4 d-flex gap-3 justify-content-end">
                        <button type="button" className="btn btn-outline-secondary px-4 fw-semibold" style={{ borderRadius: 12 }} onClick={() => setStep(1)}>
                          <i className="bi bi-arrow-left me-1" /> Geri
                        </button>
                        <button type="submit" className="btn btn-primary px-5 fw-semibold" style={{ borderRadius: 12 }}>
                          <i className="bi bi-send me-2" /> Teklif Gönder
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default OfferPage;

import { useState } from "react";
import { Link } from "react-router-dom";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="site-hero" style={{ minHeight: "50vh" }}>
        <div className="site-hero__shape site-hero__shape--1" />
        <div className="site-hero__shape site-hero__shape--2" />
        <div className="container py-5" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div className="site-hero__badge mx-auto mb-3">
            <span className="site-hero__badge-dot" />
            İletişim
          </div>
          <h1 className="site-hero__title animate-fade-up">
            Birlikte <span className="highlight">harika şeyler</span> yaratalım
          </h1>
          <p className="site-hero__desc mx-auto animate-fade-up animate-delay-1">
            Projenizi dinlemek için buradayız. Formu doldurun, 24 saat içinde size dönelim.
          </p>
          <nav aria-label="breadcrumb" className="animate-fade-up animate-delay-2">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/" style={{ color: "rgba(255,255,255,0.5)" }}>Ana Sayfa</Link></li>
              <li className="breadcrumb-item active" style={{ color: "#a5b4fc" }}>İletişim</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Contact section */}
      <section className="page-section section-light">
        <div className="container">
          <div className="row g-5 align-items-start">
            {/* Info col */}
            <div className="col-lg-4 animate-fade-left">
              <h2 className="h4 fw-bold mb-4">İletişim Bilgileri</h2>

              {[
                { icon: "bi-geo-alt-fill", title: "Adres", lines: ["Bozok Teknopark,", "Bozok Ünv. Erdoğan Akdağ Kampüsü / Yozgat"] },
                { icon: "bi-telephone-fill", title: "Telefon", lines: ["+90 354 000 00 00", "+90 532 000 00 00"] },
                { icon: "bi-envelope-fill", title: "E-posta", lines: ["info@uslukilicyazilim.com", "destek@uslukilicyazilim.com"] },
                { icon: "bi-clock-fill", title: "Çalışma Saatleri", lines: ["Pzt – Cum: 09:00–18:00", "Cumartesi: 10:00–14:00"] },
              ].map((item) => (
                <div key={item.title} className="d-flex gap-3 mb-4">
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "rgba(99,102,241,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, color: "#6366f1",
                    }}
                  >
                    <i className={`bi ${item.icon}`} style={{ fontSize: 18 }} />
                  </div>
                  <div>
                    <div className="fw-bold mb-1" style={{ fontSize: "0.87rem" }}>{item.title}</div>
                    {item.lines.map((l) => (
                      <div key={l} className="text-secondary" style={{ fontSize: "0.9rem" }}>{l}</div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="d-flex gap-2 mt-2">
                {[
                  { icon: "bi-linkedin", href: "#" },
                  { icon: "bi-twitter-x", href: "#" },
                  { icon: "bi-github", href: "#" },
                  { icon: "bi-instagram", href: "#" },
                ].map((s) => (
                  <a
                    key={s.icon}
                    href={s.href}
                    style={{
                      width: 38, height: 38, borderRadius: 10,
                      border: "1px solid var(--color-border)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      color: "var(--color-text-muted)", transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-muted)"; }}
                  >
                    <i className={`bi ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>

            {/* Form col */}
            <div className="col-lg-8 animate-fade-right">
              <div className="surface-card p-4 p-lg-5" style={{ borderRadius: 24 }}>
                {sent ? (
                  <div className="text-center py-5">
                    <div
                      style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: "rgba(52,211,153,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 1.5rem", fontSize: 32, color: "#34d399",
                      }}
                    >
                      <i className="bi bi-check-lg" />
                    </div>
                    <h3 className="fw-bold mb-2">Mesajınız İletildi!</h3>
                    <p className="text-secondary mb-4">En geç 24 saat içinde size dönüş yapacağız.</p>
                    <button className="btn btn-primary px-5" style={{ borderRadius: 12 }} onClick={() => setSent(false)}>
                      Yeni Mesaj Gönder
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h2 className="h5 fw-bold mb-4">Bize Yazın</h2>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Ad Soyad *</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="form-control contact-input"
                          placeholder="Ad Soyad"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">E-posta *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="form-control contact-input"
                          placeholder="ornek@email.com"
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold small">Konu *</label>
                        <select
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="form-select contact-input"
                          required
                        >
                          <option value="">Konu seçin…</option>
                          <option>Web Yazılım</option>
                          <option>Mobil Uygulama</option>
                          <option>Yapay Zekâ</option>
                          <option>Siber Güvenlik</option>
                          <option>Genel Bilgi</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold small">Mesaj *</label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          className="form-control contact-input"
                          rows={5}
                          placeholder="Projeniz hakkında kısaca bilgi verin…"
                          required
                        />
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100 fw-bold py-3" style={{ borderRadius: 12 }}>
                          <i className="bi bi-send me-2" />
                          Mesaj Gönder
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;

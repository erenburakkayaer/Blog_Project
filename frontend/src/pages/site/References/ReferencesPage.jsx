import { Link } from "react-router-dom";

const logos = [
  { name: "Garanti BBVA", icon: "bi-bank" },
  { name: "Turkcell", icon: "bi-telephone" },
  { name: "Arçelik", icon: "bi-tv" },
  { name: "THY", icon: "bi-airplane" },
  { name: "Sabancı", icon: "bi-buildings" },
  { name: "Migros", icon: "bi-cart3" },
  { name: "Anadolu Grubu", icon: "bi-briefcase" },
  { name: "Koç Holding", icon: "bi-gear" },
  { name: "Enerjisa", icon: "bi-lightning" },
  { name: "Hepsiburada", icon: "bi-bag" },
  { name: "Trendyol", icon: "bi-shop" },
  { name: "Boyner", icon: "bi-tag" },
];

const testimonials = [
  { name: "Ahmet Kara", role: "CTO, FinTech A.Ş.", text: "Uslukılıç Yazılım ekibi, karmaşık fintech projemizi zamanında ve bütçe dahilinde teslim etti. Teknik yetkinlikleri ve profesyonellikleri mükemmeldi.", color: "#6366f1" },
  { name: "Zeynep Aydın", role: "Genel Müdür, E-Ticaret Ltd.", text: "Platformumuzu tamamen yeniden yazdılar. Dönüşüm oranımız %40 arttı. Kesinlikle tavsiye ediyorum.", color: "#38bdf8" },
  { name: "Mert Özcan", role: "Ürün Yöneticisi, SaaS Co.", text: "Çevik süreçleri sayesinde her sprint sonunda somut çıktılar gördük. İletişimleri mükemmeldi.", color: "#34d399" },
];

function ReferencesPage() {
  return (
    <>
      {/* Hero */}
      <section className="site-hero" style={{ minHeight: "50vh" }}>
        <div className="site-hero__shape site-hero__shape--1" />
        <div className="site-hero__shape site-hero__shape--2" />
        <div className="container py-5" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div className="site-hero__badge mx-auto mb-3"><span className="site-hero__badge-dot" />Referanslar</div>
          <h1 className="site-hero__title animate-fade-up">Güven veren <span className="highlight">iş ortaklıkları</span></h1>
          <p className="site-hero__desc mx-auto animate-fade-up animate-delay-1">
            Türkiye'nin önde gelen şirketleriyle çalışıyoruz.
          </p>
          <nav aria-label="breadcrumb" className="animate-fade-up animate-delay-2">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/" style={{ color: "rgba(255,255,255,0.5)" }}>Ana Sayfa</Link></li>
              <li className="breadcrumb-item active" style={{ color: "#a5b4fc" }}>Referanslar</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Logo grid */}
      <section className="page-section section-light">
        <div className="container">
          <div className="page-heading text-center">
            <span className="page-heading__eyebrow">Müşterilerimiz</span>
            <h2 className="page-heading__title">Birlikte çalıştığımız markalar</h2>
          </div>
          <div className="row g-3">
            {logos.map((logo, i) => (
              <div key={logo.name} className="col-6 col-md-4 col-lg-3 col-xl-2 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="reference-logo flex-column gap-2">
                  <i className={`bi ${logo.icon}`} style={{ fontSize: 28, color: "#6366f1" }} />
                  <span style={{ fontSize: "0.82rem" }}>{logo.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="page-section">
        <div className="container">
          <div className="page-heading text-center">
            <span className="page-heading__eyebrow">Müşteri Yorumları</span>
            <h2 className="page-heading__title">Müşterilerimiz ne diyor?</h2>
          </div>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div key={t.name} className="col-md-4 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="surface-card p-4 h-100">
                  <div className="d-flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <i key={j} className="bi bi-star-fill" style={{ color: "#f59e0b", fontSize: 14 }} />
                    ))}
                  </div>
                  <p className="text-secondary mb-4" style={{ fontSize: "0.93rem", lineHeight: 1.7 }}>
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="d-flex align-items-center gap-3 mt-auto">
                    <div
                      style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <i className="bi bi-person-fill text-white" style={{ fontSize: 20 }} />
                    </div>
                    <div>
                      <div className="fw-bold" style={{ fontSize: "0.9rem" }}>{t.name}</div>
                      <div className="text-secondary" style={{ fontSize: "0.8rem" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ReferencesPage;

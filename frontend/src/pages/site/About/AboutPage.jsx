import { Link } from "react-router-dom";

const values = [
  { icon: "bi-lightbulb", title: "İnovasyon", desc: "Teknolojiyi sürekli takip eder, en güncel çözümleri müşterilerimize sunarız.", color: "#6366f1" },
  { icon: "bi-shield-check", title: "Güven", desc: "Şeffaf iletişim ve güvenilir süreçlerle uzun vadeli ilişkiler inşa ederiz.", color: "#38bdf8" },
  { icon: "bi-gem", title: "Kalite", desc: "Her satır kod, sertifikalı standartlara ve titiz test süreçlerine tabidir.", color: "#34d399" },
  { icon: "bi-arrow-repeat", title: "Sürdürülebilirlik", desc: "Uzun ömürlü, bakımı kolay ve çevre dostu yazılımlar tasarlarız.", color: "#f59e0b" },
];

const team = [
  { name: "Samet Başkale", role: "Frontend Developer", desc: "React, Vite ve Arayüz Mimarisi", icon: "bi-person-circle" },
  { name: "Frontend Uzmanı", role: "Frontend Developer", desc: "UI/UX & Modüler Tasarım", icon: "bi-person-circle" },
  { name: "Backend Mimar", role: "Backend & DB Developer", desc: "API, Node.js & Güvenlik", icon: "bi-person-circle" },
  { name: "Veritabanı Uzmanı", role: "Database Engineer", desc: "Veritabanı Mimarisi & ORM", icon: "bi-person-circle" },
];

const timeline = [
  { year: "2024", title: "Ekip Yapılanması", desc: "Uslukılıç Yazılım bünyesinde 4 kişilik mühendislik ekibimiz oluşturuldu." },
  { year: "2025", title: "Bozok Teknopark Ofisi", desc: "Bozok Üniversitesi Erdoğan Akdağ Kampüsü Teknopark alanında AR-GE çalışmalarımıza başladık." },
  { year: "2026", title: "Ürün & Platform Dağıtımı", desc: "Kurumsal web, mobil ve dinamik yönetim panelli platformlarımızı yayına aldık." },
];

function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="site-hero" style={{ minHeight: "55vh" }}>
        <div className="site-hero__shape site-hero__shape--1" />
        <div className="site-hero__shape site-hero__shape--2" />
        <div className="container py-5" style={{ position: "relative", zIndex: 2 }}>
          <div className="text-center">
            <div className="site-hero__badge mx-auto mb-3">
              <span className="site-hero__badge-dot" />
              Kurumsal
            </div>
            <h1 className="site-hero__title animate-fade-up">Hakkımızda</h1>
            <p className="site-hero__desc mx-auto animate-fade-up animate-delay-1">
              Bozok Teknopark merkezli Uslukılıç Yazılım olarak güçlü dijital çözümler üretiyoruz.
            </p>
            <nav aria-label="breadcrumb" className="animate-fade-up animate-delay-2">
              <ol className="breadcrumb justify-content-center mb-0" style={{ color: "rgba(255,255,255,0.5)" }}>
                <li className="breadcrumb-item"><Link to="/" style={{ color: "rgba(255,255,255,0.5)" }}>Ana Sayfa</Link></li>
                <li className="breadcrumb-item active" style={{ color: "#a5b4fc" }}>Hakkımızda</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="page-section section-light">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 animate-fade-left">
              <span className="page-heading__eyebrow">Hikayemiz</span>
              <h2 className="page-heading__title">Bozok Teknopark'ta Geleceği İnşa Ediyoruz</h2>
              <p className="text-secondary mb-3">
                <strong>Uslukılıç Yazılım</strong>; Yozgat Bozok Üniversitesi Erdoğan Akdağ Kampüsü Bozok Teknopark bünyesinde faaliyet gösteren 4 kişilik odaklanmış bir yazılım ekibidir.
              </p>
              <p className="text-secondary mb-4">
                Ekibimizde 2 kişilik <strong>Frontend Geliştirme</strong> ekibi modern, performanslı ve animasyonlu arayüzleri inşa ederken; 2 kişilik <strong>Backend & Veritabanı</strong> ekibimiz yüksek güvenlikli API ve veritabanı mimarisini bağlamaktadır.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/projeler" className="btn btn-primary px-4 fw-semibold" style={{ borderRadius: 10 }}>
                  Projelerimize Bakın
                </Link>
                <Link to="/iletisim" className="btn btn-outline-secondary px-4 fw-semibold" style={{ borderRadius: 10 }}>
                  İletişime Geçin
                </Link>
              </div>
            </div>
            <div className="col-lg-6 animate-fade-right">
              <div className="row g-3">
                {[
                  { icon: "bi-people", label: "4 Kişilik Ekip", sub: "2 Frontend + 2 Backend & DB" },
                  { icon: "bi-building", label: "Bozok Teknopark", sub: "Erdoğan Akdağ Kampüsü / Yozgat" },
                  { icon: "bi-code-slash", label: "Full-Stack Çözüm", sub: "Web, Mobil & REST API" },
                  { icon: "bi-shield-check", label: "%100 Güvenli", sub: "Veritabanı & API Altyapısı" },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="col-6">
                    <div className="surface-card p-4 text-center">
                      <i className={`bi ${icon} fs-1 mb-2`} style={{ color: "#6366f1" }} />
                      <div className="fw-bold fs-5">{label}</div>
                      <div className="text-secondary" style={{ fontSize: "0.85rem" }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="page-section">
        <div className="container">
          <div className="page-heading text-center">
            <span className="page-heading__eyebrow">Değerlerimiz</span>
            <h2 className="page-heading__title">Bizi biz yapan ilkeler</h2>
          </div>
          <div className="row g-4">
            {values.map((v, i) => (
              <div key={v.title} className="col-md-6 col-xl-3 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="service-card p-4">
                  <div className="service-card__icon" style={{ color: v.color, background: `${v.color}18` }}>
                    <i className={`bi ${v.icon}`} />
                  </div>
                  <h3 className="h5 fw-bold mb-2">{v.title}</h3>
                  <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="page-section section-light">
        <div className="container">
          <div className="page-heading text-center">
            <span className="page-heading__eyebrow">Ekibimiz</span>
            <h2 className="page-heading__title">Uzman kadromuzla tanışın</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {team.map((m, i) => (
              <div key={m.name} className="col-sm-6 col-lg-3 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="team-card">
                  <div
                    className="team-card__avatar d-flex align-items-center justify-content-center"
                    style={{
                      width: 80, height: 80, borderRadius: "50%", margin: "0 auto 1rem",
                      background: "linear-gradient(135deg, #6366f1, #38bdf8)",
                    }}
                  >
                    <i className="bi bi-person-fill text-white" style={{ fontSize: 36 }} />
                  </div>
                  <h3 className="h6 fw-bold mb-1">{m.name}</h3>
                  <span className="badge rounded-pill" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", fontSize: "0.78rem" }}>
                    {m.role}
                  </span>
                  <div className="d-flex justify-content-center gap-2 mt-3">
                    {["bi-linkedin", "bi-twitter-x"].map((ic) => (
                      <a key={ic} href="#" className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 8, width: 32, height: 32, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <i className={`bi ${ic}`} style={{ fontSize: 14 }} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="page-section section-dark">
        <div className="container">
          <div className="page-heading text-center text-white">
            <span className="page-heading__eyebrow">Yolculuğumuz</span>
            <h2 className="page-heading__title text-white">2016&apos;dan bugüne</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="timeline">
                {timeline.map((item) => (
                  <div key={item.year} className="timeline-item">
                    <span
                      className="badge rounded-pill mb-2"
                      style={{ background: "#6366f1", color: "#fff", fontSize: "0.8rem", fontWeight: 700 }}
                    >
                      {item.year}
                    </span>
                    <h3 className="h6 fw-bold text-white mb-1">{item.title}</h3>
                    <p className="mb-0" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;

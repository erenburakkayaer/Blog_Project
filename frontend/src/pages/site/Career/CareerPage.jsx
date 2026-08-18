import { Link } from "react-router-dom";

const perks = [
  { icon: "bi-graph-up-arrow", title: "Kariyer Gelişimi", desc: "Bireysel gelişim planları, mentorluk ve konferans destekleri.", color: "#6366f1" },
  { icon: "bi-wallet2", title: "Rekabetçi Maaş", desc: "Piyasanın üzerinde ücretler, performans primleri ve hisse opsiyonları.", color: "#38bdf8" },
  { icon: "bi-laptop", title: "Hibrit Çalışma", desc: "Uzaktan ya da ofisten çalışma esnekliği, en son ekipman desteği.", color: "#34d399" },
  { icon: "bi-heart", title: "Yan Haklar", desc: "Özel sağlık sigortası, yemek ve ulaşım desteği, spor üyeliği.", color: "#f59e0b" },
];

const openings = [
  { title: "Senior Frontend Developer", dept: "Mühendislik", type: "Tam Zamanlı", location: "Hibrit", tags: ["React", "TypeScript", "Next.js"] },
  { title: "Backend Engineer (Node.js)", dept: "Mühendislik", type: "Tam Zamanlı", location: "Uzaktan", tags: ["Node.js", "PostgreSQL", "Redis"] },
  { title: "ML / AI Engineer", dept: "Yapay Zekâ", type: "Tam Zamanlı", location: "Uzaktan", tags: ["Python", "PyTorch", "LLM"] },
  { title: "UI/UX Designer", dept: "Tasarım", type: "Tam Zamanlı", location: "Hibrit", tags: ["Figma", "Design Systems"] },
  { title: "DevOps Engineer", dept: "Altyapı", type: "Tam Zamanlı", location: "Uzaktan", tags: ["Kubernetes", "AWS", "Terraform"] },
];

function CareerPage() {
  return (
    <>
      {/* Hero */}
      <section className="site-hero" style={{ minHeight: "55vh" }}>
        <div className="site-hero__shape site-hero__shape--1" />
        <div className="site-hero__shape site-hero__shape--2" />
        <div className="container py-5" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div className="site-hero__badge mx-auto mb-3"><span className="site-hero__badge-dot" />Kariyer</div>
          <h1 className="site-hero__title animate-fade-up">Ekibimizle <span className="highlight">geleceği inşa et</span></h1>
          <p className="site-hero__desc mx-auto animate-fade-up animate-delay-1">
            Yetenekli, tutkulu ve meraklı kişileri arıyoruz. Seninle büyümek istiyoruz.
          </p>
          <nav aria-label="breadcrumb" className="animate-fade-up animate-delay-2">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/" style={{ color: "rgba(255,255,255,0.5)" }}>Ana Sayfa</Link></li>
              <li className="breadcrumb-item active" style={{ color: "#a5b4fc" }}>Kariyer</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Perks */}
      <section className="page-section section-light">
        <div className="container">
          <div className="page-heading text-center">
            <span className="page-heading__eyebrow">Neden Uslukılıç Yazılım?</span>
            <h2 className="page-heading__title">Çalışmanın ayrıcalıkları</h2>
          </div>
          <div className="row g-4">
            {perks.map((p, i) => (
              <div key={p.title} className="col-md-6 col-xl-3 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="service-card">
                  <div className="service-card__icon" style={{ color: p.color, background: `${p.color}18` }}>
                    <i className={`bi ${p.icon}`} />
                  </div>
                  <h3 className="h5 fw-bold mb-2">{p.title}</h3>
                  <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="page-section">
        <div className="container">
          <div className="page-heading">
            <span className="page-heading__eyebrow">Açık Pozisyonlar</span>
            <h2 className="page-heading__title">{openings.length} pozisyon sizi bekliyor</h2>
          </div>
          <div className="d-flex flex-column gap-3">
            {openings.map((job, i) => (
              <div key={job.title} className="career-card d-flex flex-column flex-md-row align-items-md-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex-grow-1">
                  <h3 className="h6 fw-bold mb-1">{job.title}</h3>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <span className="badge" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", fontSize: "0.75rem" }}>{job.dept}</span>
                    <span className="text-secondary" style={{ fontSize: "0.82rem" }}>
                      <i className="bi bi-briefcase me-1" />{job.type}
                    </span>
                    <span className="text-secondary" style={{ fontSize: "0.82rem" }}>
                      <i className="bi bi-geo-alt me-1" />{job.location}
                    </span>
                  </div>
                  <div className="d-flex flex-wrap gap-1">
                    {job.tags.map((t) => (
                      <span key={t} className="badge rounded-pill" style={{ background: "var(--color-border)", color: "var(--color-text-muted)", fontSize: "0.73rem" }}>{t}</span>
                    ))}
                  </div>
                </div>
                <Link to="/iletisim" className="btn btn-primary flex-shrink-0 fw-semibold" style={{ borderRadius: 10 }}>
                  Başvur <i className="bi bi-arrow-right ms-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default CareerPage;

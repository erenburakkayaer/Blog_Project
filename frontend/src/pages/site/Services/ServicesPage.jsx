import { Link } from "react-router-dom";

const serviceList = [
  {
    icon: "bi-code-slash",
    title: "Web Yazılım",
    color: "#6366f1",
    shortDesc: "Modern, ölçeklenebilir ve performanslı web uygulamaları.",
    longDesc:
      "React, Next.js, Vue ve Node.js gibi modern teknolojilerle kurumsal web siteleri, SaaS platformlar ve e-ticaret sistemleri geliştiriyoruz. SEO dostu, hızlı yükleme süreleri ve güçlü backend altyapılarıyla projelerinizi geleceğe taşıyoruz.",
    points: ["Kurumsal Web Siteleri", "E-Ticaret Platformları", "SaaS Uygulamalar", "API Geliştirme", "CMS Entegrasyonları"],
  },
  {
    icon: "bi-phone",
    title: "Mobil Uygulama",
    color: "#38bdf8",
    shortDesc: "iOS ve Android için native performanslı uygulamalar.",
    longDesc:
      "React Native ve Flutter ile cross-platform, Swift ve Kotlin ile native mobil uygulamalar geliştiriyoruz. Play Store ve App Store yönetiminden push bildirimlerine kadar tüm süreci yönetiyoruz.",
    points: ["iOS & Android Geliştirme", "Cross-Platform Uygulamalar", "UI/UX Tasarım", "App Store Yönetimi", "Push Bildirim Altyapısı"],
  },
  {
    icon: "bi-cpu",
    title: "Yapay Zekâ & ML",
    color: "#34d399",
    shortDesc: "Akıllı otomasyon ve veriye dayalı karar destek sistemleri.",
    longDesc:
      "GPT, LLaMA ve açık kaynak modelleri entegre ederek chatbot, doküman analizi ve öneri sistemleri kuruyoruz. Makine öğrenmesi pipeline'ları ile iş süreçlerinizi otomatize ediyoruz.",
    points: ["LLM & Chatbot Geliştirme", "Görüntü İşleme", "Öneri Sistemleri", "Veri Analizi & BI", "MLOps & Model Dağıtımı"],
  },
  {
    icon: "bi-shield-check",
    title: "Siber Güvenlik",
    color: "#f59e0b",
    shortDesc: "Proaktif güvenlik testleri ve 7/24 izleme hizmetleri.",
    longDesc:
      "OWASP standartlarında penetrasyon testleri, kaynak kod analizi, güvenlik denetimleri ve SOC hizmetleri sunuyoruz. ISO 27001 uyumlu güvenlik altyapıları kuruyoruz.",
    points: ["Penetrasyon Testleri", "Güvenlik Denetimleri", "SOC & SIEM", "ISO 27001 Danışmanlığı", "Olay Müdahale"],
  },
  {
    icon: "bi-cloud-arrow-up",
    title: "Cloud & DevOps",
    color: "#a855f7",
    shortDesc: "AWS, Azure ve GCP üzerinde ölçeklenebilir altyapı tasarımı.",
    longDesc:
      "Kubernetes, Docker ve CI/CD pipeline'ları kurarak uygulamalarınızı otomatize ediyoruz. Infrastructure as Code ile güvenilir ve tekrarlanabilir altyapılar oluşturuyoruz.",
    points: ["AWS / Azure / GCP", "Kubernetes & Docker", "CI/CD Pipeline", "Infrastructure as Code", "Maliyet Optimizasyonu"],
  },
  {
    icon: "bi-palette",
    title: "UI/UX Tasarım",
    color: "#ec4899",
    shortDesc: "Kullanıcı odaklı, erişilebilir ve çekici arayüz tasarımları.",
    longDesc:
      "Figma ile prototipten prodüksiyona kadar tüm tasarım sürecini yönetiyoruz. Kullanıcı araştırması, usability testleri ve design system oluşturma konularında uzmanlaşmış ekibimiz hizmetinizde.",
    points: ["UI/UX Araştırma", "Figma Prototipleme", "Design System", "Usability Testi", "Marka Kimliği"],
  },
];

const process = [
  { icon: "bi-search", step: "01", title: "Keşif", desc: "İhtiyaç analizi ve kapsamlı gereksinim değerlendirmesi." },
  { icon: "bi-pencil-square", step: "02", title: "Tasarım", desc: "Wireframe, prototip ve görsel tasarım aşamaları." },
  { icon: "bi-gear", step: "03", title: "Geliştirme", desc: "Çevik metodoloji ile sprint bazlı yazılım geliştirme." },
  { icon: "bi-bug", step: "04", title: "Test", desc: "Kapsamlı QA ve güvenlik testleri." },
  { icon: "bi-rocket-takeoff", step: "05", title: "Yayın", desc: "Canlıya alma ve son kullanıcı eğitimi." },
  { icon: "bi-arrow-repeat", step: "06", title: "Destek", desc: "7/24 teknik destek ve sürekli iyileştirme." },
];

function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="site-hero" style={{ minHeight: "55vh" }}>
        <div className="site-hero__shape site-hero__shape--1" />
        <div className="site-hero__shape site-hero__shape--2" />
        <div className="container py-5" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div className="site-hero__badge mx-auto mb-3">
            <span className="site-hero__badge-dot" />
            Hizmetlerimiz
          </div>
          <h1 className="site-hero__title animate-fade-up">
            İşletmenizi <span className="highlight">dönüştüren</span> teknoloji
          </h1>
          <p className="site-hero__desc mx-auto animate-fade-up animate-delay-1">
            Web, mobil, yapay zekâ ve siber güvenlik alanlarında
            uçtan uca profesyonel çözümler sunuyoruz.
          </p>
          <nav aria-label="breadcrumb" className="animate-fade-up animate-delay-2">
            <ol className="breadcrumb justify-content-center mb-0" style={{ color: "rgba(255,255,255,0.5)" }}>
              <li className="breadcrumb-item"><Link to="/" style={{ color: "rgba(255,255,255,0.5)" }}>Ana Sayfa</Link></li>
              <li className="breadcrumb-item active" style={{ color: "#a5b4fc" }}>Hizmetler</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Service cards */}
      <section className="page-section section-light">
        <div className="container">
          <div className="row g-4">
            {serviceList.map((s, i) => (
              <div key={s.title} className="col-md-6 col-xl-4 animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="service-card h-100">
                  <div className="service-card__icon" style={{ color: s.color, background: `${s.color}18` }}>
                    <i className={`bi ${s.icon}`} />
                  </div>
                  <h2 className="h5 fw-bold mb-2">{s.title}</h2>
                  <p className="text-secondary mb-3" style={{ fontSize: "0.9rem" }}>{s.longDesc}</p>
                  <ul className="list-unstyled m-0">
                    {s.points.map((p) => (
                      <li key={p} className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: "0.85rem" }}>
                        <i className="bi bi-check2-circle" style={{ color: s.color, flexShrink: 0 }} />
                        <span className="text-secondary">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="page-section">
        <div className="container">
          <div className="page-heading text-center">
            <span className="page-heading__eyebrow">Çalışma Sürecimiz</span>
            <h2 className="page-heading__title">Adım adım mükemmelliğe</h2>
          </div>
          <div className="row g-4">
            {process.map((p, i) => (
              <div key={p.title} className="col-md-4 col-lg-2 text-center animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div
                  style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #38bdf8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 1rem", fontSize: "1.4rem", color: "#fff",
                  }}
                >
                  <i className={`bi ${p.icon}`} />
                </div>
                <div className="fw-bold mb-1" style={{ color: "#6366f1", fontSize: "0.8rem", letterSpacing: "0.06em" }}>{p.step}</div>
                <h3 className="h6 fw-bold mb-1">{p.title}</h3>
                <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section">
        <div className="container">
          <div className="cta-banner">
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 className="fw-bold mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)" }}>
                Hangi hizmetimiz size uygun?
              </h2>
              <p className="mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>
                Uzmanlarımız ihtiyaçlarınızı dinleyip en doğru çözümü önersin.
              </p>
              <Link to="/teklif-al" className="btn btn-light btn-lg fw-bold px-5" style={{ borderRadius: 12 }}>
                Ücretsiz Danışmanlık Al
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;

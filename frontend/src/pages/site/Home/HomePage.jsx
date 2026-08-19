import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const services = [
  { icon: "bi-code-slash", title: "Web Yazılım", desc: "Hızlı, güvenli ve ölçeklenebilir web çözümleri." },
  { icon: "bi-phone", title: "Mobil Uygulama", desc: "iOS ve Android için kullanıcı odaklı ürünler." },
  { icon: "bi-cpu", title: "Yapay Zekâ", desc: "Veriye dayalı otomasyon ve akıllı çözümler." },
  { icon: "bi-shield-check", title: "Siber Güvenlik", desc: "Dijital varlıklarınız için güçlü koruma." },
];

const stats = [
  { number: "200+", label: "Tamamlanan Proje" },
  { number: "50+", label: "Mutlu Müşteri" },
  { number: "8", label: "Yıllık Deneyim" },
  { number: "98%", label: "Müşteri Memnuniyeti" },
];

const howSteps = [
  { icon: "bi-lightbulb", title: "Keşif & Planlama", desc: "İhtiyaçlarınızı dinler, hedefe yönelik yol haritası oluştururuz." },
  { icon: "bi-pencil-square", title: "Tasarım & Prototip", desc: "Kullanıcı deneyimini merkeze alan görsel tasarımlar yaratırız." },
  { icon: "bi-gear", title: "Geliştirme & Test", desc: "Çevik metodoloji ile hızlı ve güvenilir yazılım üretiriz." },
  { icon: "bi-rocket-takeoff", title: "Yayın & Destek", desc: "Canlıya alır, sürekli iyileştirme ve destek sağlarız." },
];

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const numStr = target.replace(/[^0-9]/g, "");
    const num = parseInt(numStr, 10);
    if (!num) { setCount(target); return; }
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * num);
      setCount(target.replace(numStr, current));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatCard({ number, label, started }) {
  const val = useCountUp(number, 1800, started);
  return (
    <div className="stat-card">
      <div className="stat-card__number">{val || number}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

function HomePage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section className="site-hero">
        <div className="site-hero__shape site-hero__shape--1" />
        <div className="site-hero__shape site-hero__shape--2" />
        <div className="site-hero__shape site-hero__shape--3" />

        <div className="container py-5" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center gy-5">
            <div className="col-lg-7">
              <div className="site-hero__badge animate-fade-up">
                <span className="site-hero__badge-dot" />
                Geleceğin Teknolojileri
              </div>

              <h1 className="site-hero__title animate-fade-up animate-delay-1">
                Fikirlerinizi{" "}
                <span className="highlight">güçlü dijital</span>
                {" "}ürünlere dönüştürüyoruz.
              </h1>

              <p className="site-hero__desc animate-fade-up animate-delay-2">
                Web, mobil, yapay zekâ ve siber güvenlik alanlarında
                ölçeklenebilir, güvenli ve modern çözümler geliştiriyoruz.
              </p>

              <div className="site-hero__actions animate-fade-up animate-delay-3">
                <Link
                  to="/teklif-al"
                  className="btn btn-primary btn-lg fw-semibold px-5"
                  style={{ borderRadius: 12 }}
                >
                  <i className="bi bi-rocket-takeoff me-2" />
                  Projenizi Başlatalım
                </Link>
                <Link
                  to="/projeler"
                  className="btn btn-outline-light btn-lg fw-semibold px-5"
                  style={{ borderRadius: 12 }}
                >
                  Projelerimiz
                </Link>
              </div>

              {/* Mini trust row */}
              <div className="d-flex flex-wrap gap-3 animate-fade-up animate-delay-4">
                {[
                  { icon: "bi-patch-check-fill", text: "ISO 27001 Sertifikalı" },
                  { icon: "bi-award-fill", text: "200+ Başarılı Proje" },
                  { icon: "bi-headset", text: "7/24 Teknik Destek" },
                ].map(({ icon, text }) => (
                  <div key={text} className="site-hero__floating-card">
                    <i className={`bi ${icon}`} style={{ color: "#6366f1" }} />
                    <span style={{ fontSize: "0.85rem" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right visual */}
            <div className="col-lg-5 d-none d-lg-flex justify-content-end animate-fade-right">
              <div
                style={{
                  width: 420,
                  height: 420,
                  borderRadius: 32,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 24,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 24, width: "100%" }}>
                  {services.map((s) => (
                    <div
                      key={s.title}
                      style={{
                        padding: "1.25rem",
                        borderRadius: 16,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                        textAlign: "center",
                      }}
                    >
                      <i className={`bi ${s.icon}`} style={{ fontSize: 28, color: "#6366f1", display: "block", marginBottom: 8 }} />
                      <div style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 600 }}>{s.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section-dark py-5" ref={statsRef}>
        <div className="container">
          <div className="row g-0">
            {stats.map((s, i) => (
              <div key={s.label} className="col-6 col-md-3">
                <div
                  className="stat-card animate-fade-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <StatCard number={s.number} label={s.label} started={statsVisible} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="page-section section-light">
        <div className="container">
          <div className="page-heading text-center">
            <span className="page-heading__eyebrow">Neler Yapıyoruz?</span>
            <h2 className="page-heading__title">İşletmenize değer katan teknoloji hizmetleri</h2>
            <p className="page-heading__description mx-auto">
              Tasarımdan geliştirmeye, güvenlikten yapay zekâya kadar tüm süreci
              profesyonel olarak yönetiyoruz.
            </p>
          </div>

          <div className="row g-4">
            {[
              { icon: "bi-code-slash", title: "Web Yazılım", color: "#6366f1", desc: "React, Next.js, Node.js ve modern framework'lerle yüksek performanslı, ölçeklenebilir web uygulamaları geliştiriyoruz.", points: ["Kurumsal Web Siteleri", "E-Ticaret Sistemleri", "SaaS Platformlar"] },
              { icon: "bi-phone", title: "Mobil Uygulama", color: "#38bdf8", desc: "iOS ve Android için React Native ve Flutter ile native performanslı, kullanıcı odaklı mobil uygulamalar üretiyoruz.", points: ["iOS & Android Geliştirme", "Cross-Platform Çözümler", "UI/UX Tasarım"] },
              { icon: "bi-cpu", title: "Yapay Zekâ & ML", color: "#34d399", desc: "Makine öğrenmesi, doğal dil işleme ve bilgisayarlı görü teknolojileriyle işletmeleri dönüştürüyoruz.", points: ["LLM Entegrasyonları", "Otomasyon Sistemleri", "Veri Analizi & BI"] },
              { icon: "bi-shield-check", title: "Siber Güvenlik", color: "#f59e0b", desc: "Penetrasyon testleri, güvenlik denetimleri ve SOC hizmetleri ile dijital varlıklarınızı koruyoruz.", points: ["Sızma Testleri", "Güvenlik Denetimleri", "SOC & SIEM Hizmetleri"] },
            ].map((s, i) => (
              <div key={s.title} className="col-md-6 col-xl-3 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <Link to="/hizmetler" className="text-decoration-none d-block h-100">
                  <div className="service-card h-100 transition-all shadow-sm hover-shadow-md">
                    <div className="service-card__icon" style={{ color: s.color, background: `${s.color}15` }}>
                      <i className={`bi ${s.icon}`} />
                    </div>
                    <h3 className="h5 fw-bold mb-2 text-dark">{s.title}</h3>
                    <p className="text-secondary mb-3" style={{ fontSize: "0.9rem" }}>{s.desc}</p>
                    <ul className="list-unstyled m-0">
                      {s.points.map((p) => (
                        <li key={p} className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                          <i className="bi bi-check2-circle" style={{ color: s.color, flexShrink: 0 }} />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-2 text-primary fw-semibold small d-flex align-items-center gap-1">
                      Detaylı İncele <i className="bi bi-arrow-right" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="page-section">
        <div className="container">
          <div className="page-heading text-center">
            <span className="page-heading__eyebrow">Nasıl Çalışıyoruz?</span>
            <h2 className="page-heading__title">Basit, şeffaf ve verimli süreç</h2>
          </div>

          <div className="row g-4">
            {howSteps.map((step, i) => (
              <div key={step.title} className="col-md-6 col-xl-3">
                <div className="how-step">
                  <div className="how-step__icon-wrap">
                    <i className={`bi ${step.icon}`} />
                    <span className="how-step__number">{i + 1}</span>
                  </div>
                  <h3 className="h6 fw-bold mb-2">{step.title}</h3>
                  <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="page-section">
        <div className="container">
          <div className="cta-banner">
            <div style={{ position: "relative", zIndex: 2 }}>
              <span
                className="badge rounded-pill mb-3 px-3 py-2"
                style={{ background: "rgba(255,255,255,0.12)", color: "#a5b4fc", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em" }}
              >
                Hadi Başlayalım
              </span>
              <h2 className="fw-bold mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
                Projenizi hayata geçirmeye hazır mısınız?
              </h2>
              <p className="mb-4" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 520, margin: "0 auto 1.5rem" }}>
                Ücretsiz danışmanlık ve özel teklif için şimdi iletişime geçin.
                Ekibimiz 24 saat içinde size dönüş yapar.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/teklif-al" className="btn btn-light btn-lg fw-bold px-5" style={{ borderRadius: 12 }}>
                  <i className="bi bi-envelope me-2" />
                  Teklif Al
                </Link>
                <Link to="/iletisim" className="btn btn-outline-light btn-lg fw-semibold px-5" style={{ borderRadius: 12 }}>
                  Bize Ulaşın
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;

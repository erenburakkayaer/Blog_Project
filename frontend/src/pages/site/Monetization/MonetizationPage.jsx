import { useState } from "react";
import { Link } from "react-router-dom";

function MonetizationPage() {
  const [reads, setReads] = useState(5000);

  // 1.000 okunma = 250 TL tahmini kazanç
  const estimatedEarnings = Math.round((reads / 1000) * 250);

  const comparison = [
    { feature: "Canlı Proje Vitrini Entegrasyonu", technova: true, medium: false, devto: false, producthunt: "Sadece Lansman" },
    { feature: "Yazar Kazanç Programı (TL / IBAN Ödemesi)", technova: true, medium: "Sadece Stripe (TR Desteklemez)", devto: false, producthunt: false },
    { feature: "Gizli (Private) Proje Barındırma", technova: true, medium: false, devto: false, producthunt: false },
    { feature: "Şirketler & İşverenlerle Doğrudan Eşleşme", technova: true, medium: false, devto: false, producthunt: false },
    { feature: "Türkçe & Global Geliştirici Topluluğu", technova: true, medium: "Karışık", devto: "İngilizce", producthunt: "İngilizce" },
  ];

  const businessModel = [
    {
      title: "TechNova Pro & Enterprise",
      icon: "bi-star-fill",
      color: "#6366f1",
      desc: "Geliştiricilere özel (private) proje barındırma ve özel alan adı olanağı; şirketlere ise onaylı teknik blog yayını ve ilan verme hakkı sunar.",
    },
    {
      title: "Proje & İçerik Öne Çıkarma (Boost)",
      icon: "bi-rocket-takeoff-fill",
      color: "#38bdf8",
      desc: "Geliştiriciler ve girişimciler projelerini veya teknik yazılarını haftalık veya aylık öne çıkararak binlerce kişiye ulaştırır.",
    },
    {
      title: "Talent Marketplace Komisyonu",
      icon: "bi-briefcase-fill",
      color: "#34d399",
      desc: "Platformdaki projeleri inceleyip beğenen şirketler geliştiricilerle anlaşma sağladığında platform %5–10 arası başarı komisyonu alır.",
    },
    {
      title: "Platform Reklam & Sponsorluk Havuzu",
      icon: "bi-wallet2",
      color: "#f59e0b",
      desc: "TechNova reklam gelirlerinin %80'ini aktif yazarlarına dağıtır, %20'sini platform geliştirme ve altyapı fonu olarak saklar.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="site-hero" style={{ minHeight: "60vh" }}>
        <div className="site-hero__shape site-hero__shape--1" />
        <div className="site-hero__shape site-hero__shape--2" />
        <div className="container py-5" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div className="site-hero__badge mx-auto mb-3">
            <span className="site-hero__badge-dot" />
            Yazar & Geliştirici Kazanç Programı
          </div>
          <h1 className="site-hero__title animate-fade-up">
            Yazılımını Anlat, Projeni Göster, <span className="highlight">Para Kazan</span>
          </h1>
          <p className="site-hero__desc mx-auto animate-fade-up animate-delay-1">
            TechNova'da yazdığınız her nitelikli teknik blog ve yayınladığınız proje size gelir kazandırır.
            Uslukılıç Yazılım güvencesiyle geliştiricilere adil kazanç sunuyoruz.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap animate-fade-up animate-delay-2">
            <Link to="/giris" className="btn btn-primary btn-lg fw-bold px-4" style={{ borderRadius: 12 }}>
              <i className="bi bi-pen-fill me-2" />
              Yazar Olarak Katıl
            </Link>
            <Link to="/projeler" className="btn btn-outline-light btn-lg fw-bold px-4" style={{ borderRadius: 12 }}>
              <i className="bi bi-grid-fill me-2" />
              Proje Vitrinini İncele
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="page-section section-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="surface-card p-4 p-lg-5 text-center" style={{ borderRadius: 28 }}>
                <span className="badge rounded-pill mb-3" style={{ background: "rgba(99,102,241,0.15)", color: "#6366f1", fontSize: "0.85rem", padding: "0.5rem 1rem" }}>
                  <i className="bi bi-calculator me-1" /> Tahmini Kazanç Hesaplayıcı
                </span>
                <h2 className="h3 fw-bold mb-2">Aylık Ne Kadar Kazanabilirsin?</h2>
                <p className="text-secondary mb-4">Aylık tahmin edilen kaliteli okunma sayını seç, kazanacağın bakiyeyi gör.</p>

                <div className="my-4 px-md-5">
                  <div className="d-flex justify-content-between font-monospace mb-2 fw-bold" style={{ fontSize: "1.2rem", color: "#6366f1" }}>
                    <span>{reads.toLocaleString("tr-TR")} Okunma / Ay</span>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={reads}
                    onChange={(e) => setReads(Number(e.target.value))}
                    style={{ height: 10 }}
                  />
                  <div className="d-flex justify-content-between text-secondary small mt-1">
                    <span>1.000</span>
                    <span>50.000</span>
                    <span>100.000 Okunma</span>
                  </div>
                </div>

                {/* Display Box */}
                <div
                  className="p-4 rounded-4 mx-auto my-4"
                  style={{
                    maxWidth: 450,
                    background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(56,189,248,0.08))",
                    border: "1px solid rgba(99,102,241,0.25)",
                  }}
                >
                  <div className="text-secondary small text-uppercase fw-bold mb-1">Tahmini Aylık Yazar Hakedişi</div>
                  <div className="display-4 fw-extrabold" style={{ color: "#34d399" }}>
                    ₺{estimatedEarnings.toLocaleString("tr-TR")}
                  </div>
                  <div className="text-muted small mt-2">
                    <i className="bi bi-info-circle me-1" />
                    Ödemeler her ayın 1'inde kayıtlı IBAN hesabınıza yatırılır. Minimum çekim eşiği 500 ₺'dir.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Transparency */}
      <section className="page-section">
        <div className="container">
          <div className="page-heading text-center">
            <span className="page-heading__eyebrow">Şeffaf İş Modeli</span>
            <h2 className="page-heading__title">TechNova Platformu Nasıl Gelir Elde Eder?</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: 650 }}>
              Sistemin sürdürülebilir olması ve yazarlarımıza düzenli ödeme yapabilmemiz için tasarladığımız 4 temel gelir kaynağı.
            </p>
          </div>

          <div className="row g-4">
            {businessModel.map((item, i) => (
              <div key={item.title} className="col-md-6 animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="service-card h-100">
                  <div className="service-card__icon" style={{ color: item.color, background: `${item.color}18` }}>
                    <i className={`bi ${item.icon}`} />
                  </div>
                  <h3 className="h5 fw-bold mb-2">{item.title}</h3>
                  <p className="text-secondary mb-0" style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="page-section section-light">
        <div className="container">
          <div className="page-heading text-center">
            <span className="page-heading__eyebrow">Karşılaştırma</span>
            <h2 className="page-heading__title">Neden TechNova'yı Tercih Etmelisiniz?</h2>
          </div>

          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle rounded-4 overflow-hidden" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                  <th className="py-3 px-4">Özellik / Karşılaştırma</th>
                  <th className="py-3 px-3 text-center" style={{ color: "#6366f1", fontSize: "1.05rem" }}>
                    ⚡ TechNova
                  </th>
                  <th className="py-3 px-3 text-center text-secondary">Medium</th>
                  <th className="py-3 px-3 text-center text-secondary">Dev.to</th>
                  <th className="py-3 px-3 text-center text-secondary">ProductHunt</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i}>
                    <td className="py-3 px-4 fw-semibold" style={{ fontSize: "0.92rem" }}>{row.feature}</td>
                    <td className="text-center py-3 text-success fw-bold">
                      {row.technova === true ? <i className="bi bi-check-circle-fill fs-5" /> : row.technova}
                    </td>
                    <td className="text-center py-3 text-secondary" style={{ fontSize: "0.85rem" }}>
                      {row.medium === false ? <i className="bi bi-x-circle text-danger fs-5" /> : row.medium}
                    </td>
                    <td className="text-center py-3 text-secondary" style={{ fontSize: "0.85rem" }}>
                      {row.devto === false ? <i className="bi bi-x-circle text-danger fs-5" /> : row.devto}
                    </td>
                    <td className="text-center py-3 text-secondary" style={{ fontSize: "0.85rem" }}>
                      {row.producthunt === false ? <i className="bi bi-x-circle text-danger fs-5" /> : row.producthunt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Steps to Become a Paid Writer */}
      <section className="page-section">
        <div className="container">
          <div className="page-heading text-center">
            <span className="page-heading__eyebrow">4 Adımda Başla</span>
            <h2 className="page-heading__title">Yazar Kazanç Programına Katılım Süreci</h2>
          </div>

          <div className="row g-4">
            {[
              { step: "01", title: "Üye Ol & Profilini Oluştur", desc: "TechNova ailesine katıl ve geliştirici/yazar profilini tanımla." },
              { step: "02", title: "Proje & Blog Yayınla", desc: "Çalıştığın projeleri vitrine ekle, teknik tecrübelerini blog olarak paylaş." },
              { step: "03", title: "Etkileşim Kazan", desc: "Yazıların okundukça ve projelerin yıldız aldıkça bakiyen otomatik birikir." },
              { step: "04", title: "IBAN'ına Ödeme Al", desc: "500 ₺ eşiğine ulaştığında panelden tek tıkla hesabına para aktar." },
            ].map((s, i) => (
              <div key={s.step} className="col-md-6 col-lg-3 text-center animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="surface-card p-4 h-100 position-relative" style={{ borderRadius: 20 }}>
                  <span className="position-absolute top-0 end-0 m-3 fw-bold text-muted opacity-25 fs-4">{s.step}</span>
                  <div
                    style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #38bdf8)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 1.25rem", color: "#fff", fontWeight: 700, fontSize: "1.2rem",
                    }}
                  >
                    {s.step}
                  </div>
                  <h3 className="h6 fw-bold mb-2">{s.title}</h3>
                  <p className="text-secondary mb-0" style={{ fontSize: "0.87rem" }}>{s.desc}</p>
                </div>
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
              <h2 className="fw-bold mb-3">İlk makaleni yaz, hemen kazanmaya başla!</h2>
              <p className="mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>
                TechNova geliştirici topluluğunda sen de yerini al. Uslukılıç Yazılım güvencesiyle içeriklerini gelire dönüştür.
              </p>
              <Link to="/giris" className="btn btn-light btn-lg fw-bold px-5" style={{ borderRadius: 12 }}>
                Ücretsiz Kayıt Ol & Başla
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MonetizationPage;

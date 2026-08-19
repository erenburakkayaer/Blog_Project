import { Link } from "react-router-dom";

const faqs = [
  { q: "Proje geliştirme süreciniz nasıl işliyor?", a: "Keşif toplantısıyla başlar, gereksinimler netleştikten sonra haftalık sprint döngüleriyle çevik metodoloji uygularız. Her sprint sonunda demo sunarız." },
  { q: "Proje teslim süreleri ne kadar?", a: "Proje kapsamına göre değişir: landing page için 1–2 hafta, kurumsal web sitesi için 4–8 hafta, karmaşık platformlar için 3–6 ay sürebilir." },
  { q: "Projem başladıktan sonra değişiklik yapabilir miyim?", a: "Evet. Değişiklik talepleri backlog'a eklenir ve öncelik sıralamasına göre işleme alınır. Küçük tweakler mevcut sprint içinde yapılabilir." },
  { q: "Kaynak kodu bize mi ait olur?", a: "Kesinlikle. Projeniz tamamlandığında tüm kaynak kodu, dokümantasyon ve varlıklar size teslim edilir." },
  { q: "Teklif almak ücretli mi?", a: "Hayır. İlk danışmanlık görüşmesi ve teklif tamamen ücretsizdir." },
  { q: "Destek ve bakım hizmeti sunuyor musunuz?", a: "Evet. Proje tesliminin ardından aylık veya yıllık bakım/destek paketleri sunuyoruz; SLA garantili 7/24 acil destek seçeneği de mevcuttur." },
  { q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?", a: "Banka havalesi, kredi kartı ve kurumsal fatura ile ödeme kabul ediyoruz. Büyük projeler için taksitli ödeme planı da oluşturabiliyoruz." },
  { q: "NDA (Gizlilik Sözleşmesi) imzalıyor musunuz?", a: "Evet. Proje başlamadan önce karşılıklı NDA imzalanır; tüm müşteri bilgileri KVKK kapsamında korunur." },
];

function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="site-hero" style={{ minHeight: "50vh" }}>
        <div className="site-hero__shape site-hero__shape--1" />
        <div className="site-hero__shape site-hero__shape--2" />
        <div className="container py-5" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div className="site-hero__badge mx-auto mb-3"><span className="site-hero__badge-dot" />SSS</div>
          <h1 className="site-hero__title animate-fade-up">Sıkça Sorulan <span className="highlight">Sorular</span></h1>
          <p className="site-hero__desc mx-auto animate-fade-up animate-delay-1">
            Aklınızdaki soruların cevapları burada. Bulamazsanız bize yazın!
          </p>
          <nav aria-label="breadcrumb" className="animate-fade-up animate-delay-2">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item"><Link to="/" style={{ color: "rgba(255,255,255,0.5)" }}>Ana Sayfa</Link></li>
              <li className="breadcrumb-item active" style={{ color: "#a5b4fc" }}>SSS</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* FAQ */}
      <section className="page-section section-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion faq-accordion" id="faqAccordion">
                {faqs.map((item, i) => (
                  <div key={i} className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button${i !== 0 ? " collapsed" : ""}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq-${i}`}
                        aria-expanded={i === 0}
                      >
                        {item.q}
                      </button>
                    </h2>
                    <div
                      id={`faq-${i}`}
                      className={`accordion-collapse collapse${i === 0 ? " show" : ""}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body text-secondary" style={{ fontSize: "0.95rem" }}>
                        {item.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section">
        <div className="container">
          <div className="cta-banner">
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 className="fw-bold mb-3">Sorunuzu bulamadınız mı?</h2>
              <p className="mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>Uzmanlarımız her sorunuzu yanıtlamaya hazır.</p>
              <Link to="/iletisim" className="btn btn-light btn-lg fw-bold px-5" style={{ borderRadius: 12 }}>İletişime Geçin</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default FAQPage;

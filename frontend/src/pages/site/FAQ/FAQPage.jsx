function FAQPage() {
  const faqs = [
    {
      q: "Web projesi ne kadar sürer?",
      a: "Projenin kapsamına göre değişmekle birlikte kurumsal web siteleri genellikle 2-4 hafta, özel yazılımlar ise 2-3 ay sürebilmektedir."
    },
    {
      q: "Hangi teknolojileri kullanıyorsunuz?",
      a: "Backend tarafında .NET Core (C#), veritabanı olarak SQL Server; frontend tarafında React, Vue veya kurumsal kimliğinize uygun modern mimariler kullanıyoruz."
    },
    {
      q: "Proje sonrası destek veriyor musunuz?",
      a: "Evet, proje tesliminden sonraki ilk 3 ay ücretsiz teknik destek sağlıyor, sonrasında ise isteğe bağlı bakım anlaşmaları sunuyoruz."
    },
    {
      q: "Mobil uygulama geliştiriyor musunuz?",
      a: "Evet, iOS ve Android platformları için hem native hem de cross-platform (React Native, Flutter) çözümler üretiyoruz."
    }
  ];

  return (
    <>
      <section className="bg-dark text-light py-5">
        <div className="container py-4 text-center">
          <h1 className="display-5 fw-bold mb-3">Sıkça Sorulan Sorular</h1>
          <p className="lead text-white-50 mx-auto" style={{ maxWidth: 600 }}>
            Hizmetlerimiz ve süreçlerimiz hakkında merak edilenler.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, i) => (
              <div className="accordion-item border-0 mb-3 shadow-sm rounded overflow-hidden" key={i}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${i !== 0 ? 'collapsed' : ''} bg-white fw-bold py-3`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${i}`}
                    aria-expanded={i === 0}
                  >
                    {faq.q}
                  </button>
                </h2>
                <div id={`collapse${i}`} className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`} data-bs-parent="#faqAccordion">
                  <div className="accordion-body text-secondary bg-white pb-4 pt-0">
                    {faq.a}
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

export default FAQPage;

function AboutPage() {
  return (
    <section className="page-section">
      <div className="container">
        <div className="page-heading">
          <span className="page-heading__eyebrow">Kurumsal</span>

          <h1 className="page-heading__title">Hakkımızda</h1>

          <p className="page-heading__description">
            Yenilikçi teknolojiler geliştirerek işletmelerin dijital dönüşüm
            süreçlerine katkı sağlıyoruz.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="surface-card p-4 p-lg-5">
              <h2 className="h3">Teknolojiyle değer üretiyoruz</h2>

              <p className="text-secondary mb-0">
                TechNova; web geliştirme, mobil uygulama, yapay zekâ ve siber
                güvenlik alanlarında kurumsal çözümler sunan yenilikçi bir
                teknoloji şirketidir.
              </p>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="surface-card p-4 p-lg-5">
              <h2 className="h3">Misyonumuz</h2>

              <p className="text-secondary mb-0">
                Güvenilir, sürdürülebilir ve kullanıcı odaklı dijital ürünler
                geliştirerek müşterilerimizin büyümesine katkı sağlamak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;

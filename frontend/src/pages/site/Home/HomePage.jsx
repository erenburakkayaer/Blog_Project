import { Link } from "react-router-dom";

const services = [
  {
    icon: "bi-code-slash",
    title: "Web Yazılım",
    description: "Hızlı, güvenli ve ölçeklenebilir web çözümleri.",
  },
  {
    icon: "bi-phone",
    title: "Mobil Uygulama",
    description: "iOS ve Android için kullanıcı odaklı ürünler.",
  },
  {
    icon: "bi-cpu",
    title: "Yapay Zekâ",
    description: "Veriye dayalı otomasyon ve akıllı çözümler.",
  },
  {
    icon: "bi-shield-check",
    title: "Siber Güvenlik",
    description: "Dijital varlıklarınız için güçlü koruma.",
  },
];

function HomePage() {
  return (
    <>
      <section className="bg-dark text-light">
        <div className="container">
          <div className="row align-items-center min-vh-75 py-5">
            <div className="col-lg-8">
              <span className="badge rounded-pill bg-primary mb-3">
                Geleceğin Teknolojileri
              </span>

              <h1 className="display-3 fw-bold mb-4">
                Fikirlerinizi güçlü dijital ürünlere dönüştürüyoruz.
              </h1>

              <p className="lead text-white-50 mb-4">
                Web, mobil, yapay zekâ ve siber güvenlik alanlarında
                ölçeklenebilir, güvenli ve modern çözümler geliştiriyoruz.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link className="btn btn-primary btn-lg" to="/teklif-al">
                  Projenizi Başlatalım
                </Link>

                <Link className="btn btn-outline-light btn-lg" to="/projeler">
                  Projelerimizi İnceleyin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="page-heading">
            <span className="page-heading__eyebrow">Neler Yapıyoruz?</span>

            <h2 className="page-heading__title">
              İşletmenize değer katan teknoloji hizmetleri
            </h2>

            <p className="page-heading__description">
              Tasarımdan geliştirmeye, güvenlikten yapay zekâya kadar bütün
              süreci profesyonel olarak yönetiyoruz.
            </p>
          </div>

          <div className="row g-4">
            {services.map((service) => (
              <div className="col-md-6 col-xl-3" key={service.title}>
                <Link to="/hizmetler" className="text-decoration-none text-dark d-block h-100">
                  <article className="surface-card p-4 h-100 hover-shadow transition-all">
                    <i
                      className={`bi ${service.icon} fs-2 text-primary d-inline-block mb-3`}
                      aria-hidden="true"
                    />

                    <h3 className="h5 fw-bold">{service.title}</h3>

                    <p className="text-secondary mb-0">{service.description}</p>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;

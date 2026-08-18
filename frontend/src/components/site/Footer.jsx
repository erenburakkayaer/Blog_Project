import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-auto">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-5">
            <h2 className="h4 fw-bold">TechNova</h2>

            <p className="text-white-50 mb-0">
              Web yazılımı, mobil uygulama, yapay zekâ ve siber güvenlik
              çözümleri geliştiren teknoloji şirketi.
            </p>
          </div>

          <div className="col-6 col-lg-3">
            <h3 className="h6 text-uppercase">Kurumsal</h3>

            <ul className="list-unstyled">
              <li className="mb-2">
                <Link className="text-white-50" to="/hakkimizda">
                  Hakkımızda
                </Link>
              </li>

              <li className="mb-2">
                <Link className="text-white-50" to="/kariyer">
                  Kariyer
                </Link>
              </li>

              <li>
                <Link className="text-white-50" to="/iletisim">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-lg-4">
            <h3 className="h6 text-uppercase">Hızlı Bağlantılar</h3>

            <ul className="list-unstyled">
              <li className="mb-2">
                <Link className="text-white-50" to="/hizmetler">
                  Hizmetler
                </Link>
              </li>

              <li className="mb-2">
                <Link className="text-white-50" to="/projeler">
                  Projeler
                </Link>
              </li>

              <li>
                <Link className="text-white-50" to="/blog">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <p className="mb-0 text-white-50 small">
          © {currentYear} TechNova. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

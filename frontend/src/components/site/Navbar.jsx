import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Ana Sayfa", path: "/" },
  { label: "Hakkımızda", path: "/hakkimizda" },
  { label: "Hizmetler", path: "/hizmetler" },
  { label: "Projeler", path: "/projeler" },
  { label: "Blog", path: "/blog" },
  { label: "Kariyer", path: "/kariyer" },
  { label: "İletişim", path: "/iletisim" },
];

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4" to="/">
          TechNova
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#siteNavbar"
          aria-controls="siteNavbar"
          aria-expanded="false"
          aria-label="Menüyü aç veya kapat"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="siteNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {navigationItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-lg-3 ${
                      isActive ? "active fw-semibold" : ""
                    }`
                  }
                  to={item.path}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}

            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <NavLink className="btn btn-primary" to="/teklif-al">
                Teklif Al
              </NavLink>
            </li>

            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <NavLink className="btn btn-outline-light" to="/giris">
                Giriş Yap
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
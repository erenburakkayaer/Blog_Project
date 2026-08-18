import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

const navigationItems = [
  { label: "Ana Sayfa", path: "/" },
  { label: "Hakkımızda", path: "/hakkimizda" },
  { label: "Hizmetler", path: "/hizmetler" },
  { label: "Projeler", path: "/projeler" },
  { label: "Blog", path: "/blog" },
  { label: "Kazanç Programı", path: "/kazanc-programi" },
  { label: "Kariyer", path: "/kariyer" },
  { label: "İletişim", path: "/iletisim" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`site-navbar navbar navbar-expand-lg navbar-dark bg-dark sticky-top${
        scrolled ? " scrolled" : ""
      }`}
    >
      <div className="container">
        {/* Brand */}
        <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" to="/">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #38bdf8)",
            }}
          >
            <i className="bi bi-lightning-fill text-white" style={{ fontSize: 18 }} />
          </span>
          <div className="d-flex align-items-center gap-2">
            <span style={{ letterSpacing: "-0.03em" }}>
              Tech<span style={{ color: "#6366f1" }}>Nova</span>
            </span>
            <span
              className="badge rounded-pill d-none d-sm-inline-block"
              style={{ background: "rgba(99,102,241,0.12)", color: "#6366f1", fontSize: "0.7rem", fontWeight: 600, border: "1px solid rgba(99,102,241,0.2)" }}
            >
              Uslukılıç Yazılım
            </span>
          </div>
        </NavLink>

        {/* Toggler */}
        <button
          className={`navbar-toggler border-0${menuOpen ? "" : " collapsed"}`}
          type="button"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Menüyü aç veya kapat"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Nav links */}
        <div className={`collapse navbar-collapse${menuOpen ? " show" : ""}`} id="siteNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {navigationItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-lg-3${isActive ? " active fw-semibold" : ""}`
                  }
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}

            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <Link
                className="btn btn-primary px-4 fw-semibold"
                to="/teklif-al"
                style={{ borderRadius: 10 }}
                onClick={() => setMenuOpen(false)}
              >
                Teklif Al
              </Link>
            </li>

            <li className="nav-item ms-lg-1 mt-2 mt-lg-0">
              <Link
                className="btn btn-outline-light px-4 fw-semibold"
                to="/giris"
                style={{ borderRadius: 10 }}
                onClick={() => setMenuOpen(false)}
              >
                Giriş
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
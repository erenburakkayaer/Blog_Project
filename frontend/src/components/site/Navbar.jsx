import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const navigationItems = [
  { label: "Ana Sayfa", path: "/" },
  { label: "Projeler & Kodlar", path: "/projeler" },
  { label: "Blog & Rehber", path: "/blog" },
  { label: "Hizmetler", path: "/hizmetler" },
  { label: "Kazanç Programı", path: "/kazanc-programi" },
  { label: "Kariyer", path: "/kariyer" },
  { label: "Hakkımızda", path: "/hakkimizda" },
  { label: "İletişim", path: "/iletisim" },
];

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Oturum kapatıldı.");
    navigate("/giris");
  };

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
                    `nav-link px-lg-2${isActive ? " active fw-semibold" : ""}`
                  }
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}

            {/* AUTHENTICATED USER MENU OR LOGIN BUTTONS */}
            {isAuthenticated && user ? (
              <li className="nav-item dropdown ms-lg-3 mt-2 mt-lg-0">
                <button
                  className="btn btn-outline-light d-flex align-items-center gap-2 rounded-pill px-3 py-1 dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    alt={user.fullName || "User"}
                    className="rounded-circle object-fit-cover"
                    style={{ width: "26px", height: "26px" }}
                  />
                  <span className="small fw-semibold">{user.fullName || user.userName || "Hesabım"}</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow-2xl border-0 py-2 mt-2 rounded-4 bg-dark text-white" style={{ minWidth: "220px", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <li className="px-3 py-2 border-bottom border-secondary border-opacity-25 mb-1">
                    <strong className="d-block text-white small">{user.fullName || "Kullanıcı"}</strong>
                    <small className="text-white-50" style={{ fontSize: "11px" }}>{user.email}</small>
                  </li>
                  <li>
                    <Link className="dropdown-item text-white py-2 d-flex align-items-center gap-2" to="/admin">
                      <i className="bi bi-grid-1x2-fill text-primary" /> Yönetim Paneli
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item text-white py-2 d-flex align-items-center gap-2" to="/admin/profil">
                      <i className="bi bi-person-badge text-info" /> Profilim & Ayarlar
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item text-white py-2 d-flex align-items-center gap-2" to="/admin/mesajlar">
                      <i className="bi bi-chat-dots-fill text-warning" /> Mesajlarım (DM)
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item text-white py-2 d-flex align-items-center gap-2" to="/profil/samet_admin">
                      <i className="bi bi-globe text-success" /> Genel Profilimi Gör
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider border-secondary border-opacity-25 my-1" /></li>
                  <li>
                    <button className="dropdown-item text-danger py-2 d-flex align-items-center gap-2" type="button" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right" /> Çıkış Yap
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <Link
                    className="btn btn-outline-light px-3 fw-semibold small"
                    to="/giris"
                    style={{ borderRadius: 10 }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="bi bi-box-arrow-in-right me-1" /> Giriş Yap
                  </Link>
                </li>
                <li className="nav-item ms-lg-1 mt-2 mt-lg-0">
                  <Link
                    className="btn btn-primary px-3 fw-semibold small"
                    to="/giris"
                    style={{ borderRadius: 10, background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <i className="bi bi-person-plus me-1" /> Kayıt Ol
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import { Link } from "react-router-dom";

const corporate = [
  { label: "Hakkımızda", path: "/hakkimizda" },
  { label: "Kariyer", path: "/kariyer" },
  { label: "Blog", path: "/blog" },
  { label: "SSS", path: "/sss" },
];

const services = [
  { label: "Web Yazılım", path: "/hizmetler" },
  { label: "Mobil Uygulama", path: "/hizmetler" },
  { label: "Yapay Zekâ", path: "/hizmetler" },
  { label: "Siber Güvenlik", path: "/hizmetler" },
];

const social = [
  { icon: "bi-linkedin", href: "#", label: "LinkedIn" },
  { icon: "bi-twitter-x", href: "#", label: "Twitter" },
  { icon: "bi-github", href: "#", label: "GitHub" },
  { icon: "bi-instagram", href: "#", label: "Instagram" },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #111827 100%)", color: "#fff" }}>
      <div className="container py-5">
        <div className="row g-5">
          {/* Brand col */}
          <div className="col-lg-4">
            <Link to="/" className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none">
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
              <span className="fw-bold fs-5" style={{ letterSpacing: "-0.03em", color: "#fff" }}>
                Uslukılıç <span style={{ color: "#6366f1" }}>Yazılım</span>
              </span>
            </Link>

            <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              Web yazılımı, mobil uygulama, yapay zekâ ve siber güvenlik
              alanlarında uçtan uca çözümler sunan Bozok Teknopark merkezli teknoloji şirketi.
            </p>

            {/* Social */}
            <div className="d-flex gap-2">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.6)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#6366f1";
                    e.currentTarget.style.color = "#6366f1";
                    e.currentTarget.style.background = "rgba(99,102,241,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <i className={`bi ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Corporate */}
          <div className="col-6 col-lg-2">
            <h3
              className="fw-bold mb-4"
              style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}
            >
              Kurumsal
            </h3>
            <ul className="list-unstyled m-0">
              {corporate.map((item) => (
                <li key={item.label} className="mb-2">
                  <Link
                    to={item.path}
                    style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.92rem", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="col-6 col-lg-2">
            <h3
              className="fw-bold mb-4"
              style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}
            >
              Hizmetler
            </h3>
            <ul className="list-unstyled m-0">
              {services.map((item) => (
                <li key={item.label} className="mb-2">
                  <Link
                    to={item.path}
                    style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.92rem", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4">
            <h3
              className="fw-bold mb-4"
              style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}
            >
              İletişim
            </h3>
            <ul className="list-unstyled m-0">
              {[
                { icon: "bi-geo-alt", text: "Bozok Teknopark, Bozok Ünv. Erdoğan Akdağ Kampüsü / Yozgat" },
                { icon: "bi-telephone", text: "+90 354 000 00 00" },
                { icon: "bi-envelope", text: "info@uslukilicyazilim.com" },
              ].map(({ icon, text }) => (
                <li key={text} className="mb-3 d-flex align-items-start gap-2">
                  <i className={`bi ${icon} mt-1`} style={{ color: "#6366f1", flexShrink: 0 }} />
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.92rem" }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 mt-5 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="mb-0" style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
            © {currentYear} Uslukılıç Yazılım. Tüm hakları saklıdır.
          </p>
          <div className="d-flex gap-3">
            {["Gizlilik Politikası", "Kullanım Koşulları"].map((t) => (
              <Link
                key={t}
                to="#"
                style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

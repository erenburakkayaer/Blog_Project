import { Navigate, Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const features = [
  {
    icon: "bi-pencil-square",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.15)",
    title: "Yazar Kazanç Programı",
    desc: "Blog yaz, okundukça her ay IBAN'ına ödeme al.",
  },
  {
    icon: "bi-folder-symlink",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.15)",
    title: "Proje Vitrini",
    desc: "Projelerini 10.000+ yazılımcıya sergile, boost et.",
  },
  {
    icon: "bi-shield-lock",
    color: "#34d399",
    bg: "rgba(52,211,153,0.15)",
    title: "Güvenli Yönetim",
    desc: "JWT tabanlı kimlik doğrulama ve rol yönetimi.",
  },
  {
    icon: "bi-bar-chart-line",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.15)",
    title: "Gerçek Zamanlı Analitik",
    desc: "Okunma, kazanç ve proje istatistiklerinizi takip edin.",
  },
];

const testimonials = [
  { name: "Samet B.", role: "Frontend Dev", avatar: "SB", text: "TechNova'da 3 ay içinde 5 projemi yayınladım. Hem görünürlük hem de kazanç harika!" },
  { name: "Zeynep K.", role: "Yazar / UI Designer", avatar: "ZK", text: "Yazar programıyla aylık ek gelir elde ediyorum. Platform çok kolay!" },
];

function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex" }}>
      {/* LEFT: Visual Panel */}
      <section
        className="auth-split__left d-none d-lg-flex flex-column justify-content-between p-5"
        style={{ width: "50%", position: "relative", zIndex: 1 }}
      >
        {/* Brand */}
        <Link to="/" className="d-inline-flex align-items-center gap-3 text-white text-decoration-none" style={{ position: "relative", zIndex: 2 }}>
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "linear-gradient(135deg, #6366f1, #38bdf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="bi bi-lightning-fill text-white" style={{ fontSize: 20 }} />
          </span>
          <div>
            <div className="fw-bold" style={{ fontSize: "1.3rem", letterSpacing: "-0.03em" }}>
              Tech<span style={{ color: "#a5b4fc" }}>Nova</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>Uslukılıç Yazılım</div>
          </div>
        </Link>

        {/* Main Content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            className="badge rounded-pill mb-4"
            style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: "0.75rem", border: "1px solid rgba(99,102,241,0.3)", padding: "0.4rem 1rem" }}
          >
            <i className="bi bi-stars me-1" /> Türkiye'nin Geliştirici Platformu
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "1rem", color: "#fff" }}>
            Geliştir, Yayınla,{" "}
            <span style={{ background: "linear-gradient(135deg, #a5b4fc, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Para Kazan.
            </span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", marginBottom: "2rem", lineHeight: 1.6 }}>
            TechNova ile projelerinizi sergileyin, blog yazılarınızdan kazanç elde edin ve yazılım topluluğuna katılın.
          </p>

          {/* Feature List */}
          <div>
            {features.map((f) => (
              <div key={f.title} className="auth-split__feature">
                <div className="auth-split__feature-icon" style={{ background: f.bg, color: f.color }}>
                  <i className={`bi ${f.icon}`} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#fff" }}>{f.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "0.85rem 1rem",
                marginBottom: "0.5rem",
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-1">
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #38bdf8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff" }}>{t.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>{t.role}</div>
                </div>
                <div className="ms-auto d-flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <i key={s} className="bi bi-star-fill" style={{ color: "#f59e0b", fontSize: "0.65rem" }} />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}

          {/* Trust bar */}
          <div className="d-flex align-items-center gap-4 mt-3">
            {[
              { icon: "bi-patch-check-fill", text: "Güvenli Giriş" },
              { icon: "bi-lock-fill", text: "SSL Korumalı" },
              { icon: "bi-building", text: "Bozok Teknopark" },
            ].map(({ icon, text }) => (
              <div key={text} className="d-flex align-items-center gap-1" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
                <i className={`bi ${icon}`} style={{ color: "#6366f1" }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT: Form Panel */}
      <section
        className="d-flex align-items-center justify-content-center flex-grow-1 p-3 p-sm-4 p-lg-5"
        style={{ background: "#0f0f1a", overflowY: "auto" }}
      >
        <div style={{ width: "100%", maxWidth: 480 }}>
          {/* Mobile Brand */}
          <div className="d-lg-none text-center mb-4">
            <Link to="/" className="d-inline-flex align-items-center gap-2 text-white text-decoration-none">
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #6366f1, #38bdf8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-lightning-fill text-white" style={{ fontSize: 18 }} />
              </span>
              <span className="fw-bold fs-4">Tech<span style={{ color: "#a5b4fc" }}>Nova</span></span>
            </Link>
          </div>

          <Outlet />
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;

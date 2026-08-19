// src/components/admin/AdminSidebar.jsx
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useSite from "../../hooks/useSite";
import useAuth from "../../hooks/useAuth";

function AdminSidebar() {
  const { settings } = useSite();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    username: user?.fullName || "Yönetici",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
  });

  const userRole = (user?.role || "admin").toLowerCase();

  // Rol Bazlı Dinamik Menü Tanımları (Udemy / BTK Akademi tarzı)
  const getMenuItems = () => {
    // 1. ŞİRKET YÖNETİCİSİ (ADMIN & SUPERADMIN) - Tam Yetki
    if (userRole === "admin" || userRole === "superadmin") {
      return [
        { to: "/admin", icon: "bi-grid-1x2-fill", label: "Dashboard", end: true },
        { to: "/admin/blog", icon: "bi-journal-richtext", label: "Blog Yönetimi", badge: "4" },
        { to: "/admin/projeler", icon: "bi-laptop", label: "Proje Vitrini", badge: "4" },
        { to: "/admin/hizmetler", icon: "bi-layers-fill", label: "Hizmetler" },
        { to: "/admin/kariyer", icon: "bi-briefcase-fill", label: "Kariyer & İlanlar", badge: "İK" },
        { to: "/admin/kullanicilar", icon: "bi-people-fill", label: "Kullanıcı & Roller", badge: "Admin" },
        { to: "/admin/mesajlar", icon: "bi-chat-dots-fill", label: "Mesaj & Teklifler" },
        { to: "/admin/profil", icon: "bi-person-badge-fill", label: "Profilim & Biyografi" },
        { to: "/admin/ayarlar", icon: "bi-sliders", label: "Sistem Ayarları" },
      ];
    }

    // 2. İNSAN KAYNAKLARI (HR)
    if (userRole === "hr") {
      return [
        { to: "/admin", icon: "bi-grid-1x2-fill", label: "İK Özeti", end: true },
        { to: "/admin/kariyer", icon: "bi-briefcase-fill", label: "Kariyer & İlanlar", badge: "Aktif" },
        { to: "/admin/mesajlar", icon: "bi-chat-dots-fill", label: "Mesajlarım (DM)", badge: "Yeni" },
        { to: "/admin/profil", icon: "bi-person-badge-fill", label: "Profilim" },
      ];
    }

    // 3. YAZAR / İÇERİK ÜRETİCİSİ (AUTHOR)
    if (userRole === "author") {
      return [
        { to: "/admin", icon: "bi-grid-1x2-fill", label: "Yazar Paneli & Bakiye", end: true },
        { to: "/admin/blog", icon: "bi-journal-richtext", label: "Bloglarım & Yaz", badge: "₺1.450" },
        { to: "/admin/projeler", icon: "bi-laptop", label: "Projelerim" },
        { to: "/admin/mesajlar", icon: "bi-chat-dots-fill", label: "Mesajlarım (DM)", badge: "Yeni" },
        { to: "/admin/profil", icon: "bi-person-badge-fill", label: "Profilim & Biyografi" },
      ];
    }

    // 4. EDİTÖR & GELİŞTİRİCİ
    if (userRole === "editor") {
      return [
        { to: "/admin", icon: "bi-grid-1x2-fill", label: "Geliştirici Paneli", end: true },
        { to: "/admin/projeler", icon: "bi-laptop", label: "Proje Vitrini", badge: "Yeni" },
        { to: "/admin/blog", icon: "bi-journal-richtext", label: "Blog Yazıları" },
        { to: "/admin/mesajlar", icon: "bi-chat-dots-fill", label: "Mesajlarım (DM)", badge: "Yeni" },
        { to: "/admin/profil", icon: "bi-person-badge-fill", label: "Profilim" },
      ];
    }

    // 5. NORMAL KULLANICI / ÖĞRENCİ
    return [
      { to: "/admin", icon: "bi-grid-1x2-fill", label: "Hesabım", end: true },
      { to: "/admin/mesajlar", icon: "bi-chat-dots-fill", label: "Mesajlarım (DM)", badge: "Yeni" },
      { to: "/admin/profil", icon: "bi-person-badge-fill", label: "Profilim & Biyografi" },
    ];
  };

  const menuItems = getMenuItems();

  const getRoleTitle = () => {
    switch (userRole) {
      case "admin":
      case "superadmin":
        return { label: "👑 Şirket Yöneticisi", color: "danger" };
      case "hr":
        return { label: "👥 İnsan Kaynakları", color: "warning" };
      case "author":
        return { label: "✍️ İçerik Üreticisi", color: "primary" };
      case "editor":
        return { label: "💻 Geliştirici", color: "info" };
      default:
        return { label: "👤 Öğrenci / Üye", color: "secondary" };
    }
  };

  const roleInfo = getRoleTitle();

  useEffect(() => {
    const loadProfile = () => {
      const saved = localStorage.getItem("technova_admin_profile");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile({
            username: parsed.username || parsed.fullName || user?.fullName || "Kullanıcı",
            avatar: parsed.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
          });
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadProfile();
    window.addEventListener("adminProfileUpdated", loadProfile);
    return () => window.removeEventListener("adminProfileUpdated", loadProfile);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/giris", { replace: true });
  };

  return (
    <aside
      className="admin-sidebar d-flex flex-column justify-content-between p-3"
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #090d16 100%)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        minHeight: "100vh",
      }}
    >
      <div>
        {/* BRAND HEADER */}
        <Link
          to="/"
          className="d-flex align-items-center gap-2 text-decoration-none px-2 py-3 mb-3 border-bottom border-secondary border-opacity-25"
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #38bdf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="bi bi-lightning-fill text-white fs-5" />
          </span>
          <div className="overflow-hidden">
            <div className="fw-bold text-white fs-6 lh-1" style={{ letterSpacing: "-0.02em" }}>
              Tech<span style={{ color: "#818cf8" }}>Nova</span>
            </div>
            <small className="text-secondary" style={{ fontSize: "11px" }}>
              Yönetim Merkezi
            </small>
          </div>
        </Link>

        {/* ROLE BADGE HEADER */}
        <div className="px-2 mb-3">
          <div
            className={`p-2 rounded-3 bg-${roleInfo.color} bg-opacity-10 border border-${roleInfo.color} border-opacity-25 d-flex align-items-center justify-content-between`}
          >
            <span className={`text-${roleInfo.color} fw-bold small`} style={{ fontSize: "11px" }}>
              {roleInfo.label}
            </span>
            <span className="badge bg-white bg-opacity-25 text-white" style={{ fontSize: "9px" }}>
              Aktif Oturum
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="d-flex flex-column gap-1">
          <small className="text-uppercase text-secondary fw-bold px-3 py-1 mb-1" style={{ fontSize: "10px", letterSpacing: "0.08em" }}>
            Yetkili Menü
          </small>

          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `d-flex align-items-center justify-content-between px-3 py-2 rounded-3 text-decoration-none transition-all ${
                  isActive
                    ? "bg-primary text-white fw-semibold shadow-sm"
                    : "text-secondary hover-text-white"
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? "linear-gradient(135deg, #4f46e5, #6366f1)" : "transparent",
                color: isActive ? "#ffffff" : "#94a3b8",
                transition: "all 0.2s ease",
              })}
            >
              <div className="d-flex align-items-center gap-3">
                <i className={`bi ${item.icon} fs-5`} />
                <span style={{ fontSize: "0.88rem" }}>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className="badge rounded-pill"
                  style={{
                    fontSize: "10px",
                    background: item.badge === "Admin" ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.15)",
                    color: item.badge === "Admin" ? "#fca5a5" : "#e2e8f0",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* FOOTER USER CARD */}
      <div className="pt-3 border-top border-secondary border-opacity-25">
        <Link
          to="/"
          target="_blank"
          className="d-flex align-items-center justify-content-between px-3 py-2 mb-3 rounded-3 text-decoration-none text-white-50 bg-white bg-opacity-10 small hover-bg-opacity-20"
          style={{ transition: "background 0.2s" }}
        >
          <span><i className="bi bi-box-arrow-up-right me-2 text-info" /> Canlı Siteyi Gör</span>
          <i className="bi bi-chevron-right small" />
        </Link>

        <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-black bg-opacity-40 border border-white border-opacity-10">
          <Link to="/admin/profil" className="d-flex align-items-center gap-2 text-decoration-none overflow-hidden">
            <img
              src={profile.avatar}
              alt={profile.username}
              className="rounded-circle object-fit-cover border border-secondary"
              style={{ width: "34px", height: "34px" }}
            />
            <div className="overflow-hidden">
              <div className="text-white fw-semibold text-truncate small lh-1">
                {profile.username}
              </div>
              <small className="text-secondary d-block mt-1 text-truncate" style={{ fontSize: "10px" }}>
                {user?.email || "admin@technova.com"}
              </small>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-link text-secondary p-1 hover-text-danger"
            title="Çıkış Yap"
          >
            <i className="bi bi-power fs-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;

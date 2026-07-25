import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/admin", icon: "bi-speedometer2", label: "Dashboard", end: true },
  { to: "/admin/blog", icon: "bi-journal-text", label: "Blog" },
  { to: "/admin/projeler", icon: "bi-folder2-open", label: "Projeler" },
  { to: "/admin/hizmetler", icon: "bi-grid", label: "Hizmetler" },
  { to: "/admin/kullanicilar", icon: "bi-people", label: "Kullanıcılar" },
  { to: "/admin/mesajlar", icon: "bi-envelope", label: "Mesajlar" },
  { to: "/admin/ayarlar", icon: "bi-gear", label: "Ayarlar" },
];

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <i className="bi bi-code-slash" />
        <span>TechNova</span>
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? "active" : ""}`
            }
          >
            <i className={`bi ${item.icon}`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;

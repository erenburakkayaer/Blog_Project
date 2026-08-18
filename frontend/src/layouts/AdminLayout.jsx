// src/layouts/AdminLayout.jsx
import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState({
    username: "Yönetici",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  });

  useEffect(() => {
    const loadProfile = () => {
      const savedProfile = localStorage.getItem("technova_admin_profile");
      if (savedProfile) {
        try {
          setAdminProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error(e);
        }
      }
    };

    loadProfile();

    // Ayarlar sayfasından yapılan güncellemeleri anlık dinlemek için event listener
    window.addEventListener("storage", loadProfile);
    window.addEventListener("adminProfileUpdated", loadProfile);

    return () => {
      window.removeEventListener("storage", loadProfile);
      window.removeEventListener("adminProfileUpdated", loadProfile);
    };
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-layout__content">
        <AdminHeader adminProfile={adminProfile} />

        <main className="admin-main">
          <Outlet context={{ adminProfile, setAdminProfile }} />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

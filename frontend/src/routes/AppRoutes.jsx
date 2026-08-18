// src/routes/AppRoutes.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import SiteLayout from "../layouts/SiteLayout";

import ProtectedRoute from "./ProtectedRoute";

import PlaceholderPage from "../components/common/PlaceholderPage";

import DashboardPage from "../pages/admin/Dashboard/DashboardPage";

import BlogListPage from "../pages/admin/Blog/BlogListPage";
import BlogCreatePage from "../pages/admin/Blog/BlogCreatePage";
import BlogEditPage from "../pages/admin/Blog/BlogEditPage";

import ProjectListPage from "../pages/admin/Projects/ProjectListPage";
import ProjectCreatePage from "../pages/admin/Projects/ProjectCreatePage";
import ProjectEditPage from "../pages/admin/Projects/ProjectEditPage";

import MessageListPage from "../pages/admin/Messages/MessageListPage";
import ServiceListPage from "../pages/admin/Services/ServiceListPage";
import ServiceEditPage from "../pages/admin/Services/ServiceEditPage";
import UserListPage from "../pages/admin/Users/UserListPage";
import SettingsPage from "../pages/admin/Settings/SettingsPage";

import LoginPage from "../pages/auth/Login/LoginPage";

import AboutPage from "../pages/site/About/AboutPage";
import HomePage from "../pages/site/Home/HomePage";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/giris",
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["admin", "editor"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "blog",
            element: <BlogListPage />,
          },
          {
            path: "blog/yeni",
            element: <BlogCreatePage />,
          },
          {
            path: "blog/:id",
            element: <BlogEditPage />,
          },
          {
            path: "projeler",
            element: <ProjectListPage />,
          },
          {
            path: "projeler/yeni",
            element: <ProjectCreatePage />,
          },
          {
            path: "projeler/:projectId/duzenle",
            element: <ProjectEditPage />,
          },
          {
            path: "hizmetler",
            element: <ServiceListPage />,
          },
          {
            path: "hizmetler/:id",
            element: <ServiceEditPage />,
          },
          {
            path: "kullanicilar",
            element: <UserListPage />,
          },
          {
            path: "mesajlar",
            element: <MessageListPage />,
          },
          {
            element: <ProtectedRoute allowedRoles={["admin"]} />,
            children: [
              {
                path: "ayarlar",
                element: <SettingsPage />,
              },
            ],
          },
          {
            path: "*",
            element: (
              <PlaceholderPage
                eyebrow="404"
                title="Admin Sayfası Bulunamadı"
                description="Aradığınız yönetim paneli sayfası bulunamadı."
              />
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <SiteLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "hakkimizda",
        element: <AboutPage />,
      },
      {
        path: "hizmetler",
        element: (
          <PlaceholderPage
            title="Hizmetlerimiz"
            description="Web, mobil, yapay zekâ ve siber güvenlik hizmetlerimizi keşfedin."
          />
        ),
      },
      {
        path: "projeler",
        element: (
          <PlaceholderPage
            title="Projelerimiz"
            description="Tamamladığımız yenilikçi projeleri inceleyin."
          />
        ),
      },
      {
        path: "referanslar",
        element: (
          <PlaceholderPage
            title="Referanslarımız"
            description="Birlikte çalıştığımız markaları ve iş ortaklarımızı görün."
          />
        ),
      },
      {
        path: "blog",
        element: (
          <PlaceholderPage
            title="Blog"
            description="Teknoloji dünyasından güncel içerikleri ve rehberleri keşfedin."
          />
        ),
      },
      {
        path: "kariyer",
        element: (
          <PlaceholderPage
            title="Kariyer"
            description="Açık pozisyonları görüntüleyin ve ekibimize katılın."
          />
        ),
      },
      {
        path: "sss",
        element: (
          <PlaceholderPage
            title="Sıkça Sorulan Sorular"
            description="Hizmetlerimiz hakkında sıkça sorulan sorulara ulaşın."
          />
        ),
      },
      {
        path: "iletisim",
        element: (
          <PlaceholderPage
            title="İletişim"
            description="Projeleriniz ve sorularınız için bizimle iletişime geçin."
          />
        ),
      },
      {
        path: "teklif-al",
        element: (
          <PlaceholderPage
            title="Teklif Al"
            description="Projenizin ayrıntılarını paylaşın, size özel teklif hazırlayalım."
          />
        ),
      },
      {
        path: "*",
        element: (
          <PlaceholderPage
            eyebrow="404"
            title="Sayfa Bulunamadı"
            description="Aradığınız sayfa taşınmış veya kaldırılmış olabilir."
          />
        ),
      },
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;

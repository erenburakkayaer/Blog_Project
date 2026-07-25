import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import SiteLayout from "../layouts/SiteLayout";

import ProtectedRoute from "./ProtectedRoute";

import PlaceholderPage from "../components/common/PlaceholderPage";

import DashboardPage from "../pages/admin/Dashboard/DashboardPage";
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
    element: <ProtectedRoute allowedRoles={["Admin"]} />,
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
            element: (
              <PlaceholderPage
                eyebrow="Admin"
                title="Blog Yönetimi"
                description="Blog içeriklerini görüntüleyin, ekleyin ve düzenleyin."
              />
            ),
          },
          {
            path: "projeler",
            element: (
              <PlaceholderPage
                eyebrow="Admin"
                title="Proje Yönetimi"
                description="Proje içeriklerini görüntüleyin, ekleyin ve düzenleyin."
              />
            ),
          },
          {
            path: "hizmetler",
            element: (
              <PlaceholderPage
                eyebrow="Admin"
                title="Hizmet Yönetimi"
                description="Hizmet içeriklerini görüntüleyin, ekleyin ve düzenleyin."
              />
            ),
          },
          {
            path: "kullanicilar",
            element: (
              <PlaceholderPage
                eyebrow="Admin"
                title="Kullanıcı Yönetimi"
                description="Sistem kullanıcılarını ve yetkilerini yönetin."
              />
            ),
          },
          {
            path: "mesajlar",
            element: (
              <PlaceholderPage
                eyebrow="Admin"
                title="Mesaj Yönetimi"
                description="İletişim ve teklif formlarından gelen mesajları görüntüleyin."
              />
            ),
          },
          {
            path: "ayarlar",
            element: (
              <PlaceholderPage
                eyebrow="Admin"
                title="Sistem Ayarları"
                description="Yönetim paneli ve site ayarlarını düzenleyin."
              />
            ),
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

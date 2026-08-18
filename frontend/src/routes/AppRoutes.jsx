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

// ── Site pages ──────────────────────────────────────────────
import HomePage from "../pages/site/Home/HomePage";
import AboutPage from "../pages/site/About/AboutPage";
import ServicesPage from "../pages/site/Services/ServicesPage";
import ProjectsPage from "../pages/site/Projects/ProjectsPage";
import BlogPage from "../pages/site/Blog/BlogPage";
import ContactPage from "../pages/site/Contact/ContactPage";
import CareerPage from "../pages/site/Career/CareerPage";
import FAQPage from "../pages/site/FAQ/FAQPage";
import ReferencesPage from "../pages/site/References/ReferencesPage";
import OfferPage from "../pages/site/Offer/OfferPage";
import MonetizationPage from "../pages/site/Monetization/MonetizationPage";

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
        element: <ServicesPage />,
      },
      {
        path: "projeler",
        element: <ProjectsPage />,
      },
      {
        path: "blog",
        element: <BlogPage />,
      },
      {
        path: "iletisim",
        element: <ContactPage />,
      },
      {
        path: "kariyer",
        element: <CareerPage />,
      },
      {
        path: "sss",
        element: <FAQPage />,
      },
      {
        path: "referanslar",
        element: <ReferencesPage />,
      },
      {
        path: "teklif-al",
        element: <OfferPage />,
      },
      {
        path: "kazanc-programi",
        element: <MonetizationPage />,
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

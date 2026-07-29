// src/pages/admin/Dashboard/DashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import DashboardActivity from "../../../components/admin/dashboard/DashboardActivity";
import DashboardCharts from "../../../components/admin/dashboard/DashboardCharts";
import DashboardSkeleton from "../../../components/admin/dashboard/DashboardSkeleton";
import DashboardStatCard from "../../../components/admin/dashboard/DashboardStatCard";
import DashboardWelcome from "../../../components/admin/dashboard/DashboardWelcome";
import { blogService } from "../../../services/blogService";
import projectService from "../../../services/projectService";
import { serviceService } from "../../../services/serviceService"; // <-- YENİ EKLENDİ

const RECENT_CONTENT_LIMIT = 6;
const ACTIVITY_LIMIT = 6;

const statusLabels = {
  published: "Yayında",
  draft: "Taslak",
  archived: "Arşivlendi",
  completed: "Tamamlandı",
  active: "Aktif",
  passive: "Pasif",
};

const statusBadgeClasses = {
  published: "text-bg-success",
  draft: "text-bg-warning",
  archived: "text-bg-secondary",
  completed: "text-bg-primary",
  active: "text-bg-success",
  passive: "text-bg-secondary",
};

const getValidDate = (dateValue) => {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (dateValue) => {
  const date = getValidDate(dateValue);
  if (!date) return "-";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatShortDate = (dateValue) => {
  const date = getValidDate(dateValue);
  if (!date) return "-";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
  }).format(date);
};

const formatTime = (dateValue) => {
  const date = getValidDate(dateValue);
  if (!date) return "Kayıt bulunmuyor";
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const calculateTrend = (items) => {
  const now = new Date();
  const currentPeriodStart = new Date(now);
  currentPeriodStart.setDate(now.getDate() - 7);

  const previousPeriodStart = new Date(now);
  previousPeriodStart.setDate(now.getDate() - 14);

  const currentPeriodCount = items.filter((item) => {
    const itemDate = getValidDate(item.createdAt);
    return itemDate && itemDate >= currentPeriodStart && itemDate <= now;
  }).length;

  const previousPeriodCount = items.filter((item) => {
    const itemDate = getValidDate(item.createdAt);
    return (
      itemDate &&
      itemDate >= previousPeriodStart &&
      itemDate < currentPeriodStart
    );
  }).length;

  if (previousPeriodCount === 0) {
    return currentPeriodCount > 0 ? 100 : 0;
  }

  return Math.round(
    ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100,
  );
};

function DashboardPage() {
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]); // <-- YENİ EKLENDİ
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        const [blogData, projectData, serviceData] = await Promise.all([
          blogService.getAll(),
          Promise.resolve(projectService.getAll()),
          serviceService.getAll(), // <-- YENİ EKLENDİ
        ]);

        if (!isMounted) return;

        setBlogs(Array.isArray(blogData) ? blogData : []);
        setProjects(Array.isArray(projectData) ? projectData : []);
        setServices(Array.isArray(serviceData?.data) ? serviceData.data : []); // <-- YENİ EKLENDİ
      } catch {
        if (isMounted) {
          toast.error("Dashboard verileri yüklenirken bir hata oluştu.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const statistics = useMemo(() => {
    const publishedBlogs = blogs.filter(
      (blog) => blog.status === "published",
    ).length;
    const publishedProjects = projects.filter(
      (project) => project.status === "published",
    ).length;
    const activeServices = services.filter(
      (service) => service.status === "active",
    ).length; // <-- YENİ

    const draftBlogs = blogs.filter((blog) => blog.status === "draft").length;
    const draftProjects = projects.filter(
      (project) => project.status === "draft",
    ).length;
    const featuredProjects = projects.filter(
      (project) => project.featured === true,
    ).length;

    const contentDates = [...blogs, ...projects, ...services]
      .map((item) => item.updatedAt || item.createdAt)
      .map(getValidDate)
      .filter(Boolean);

    const lastUpdatedAt =
      contentDates.length > 0
        ? new Date(Math.max(...contentDates.map((date) => date.getTime())))
        : null;

    const publishedCount = publishedBlogs + publishedProjects + activeServices;
    const draftCount = draftBlogs + draftProjects;
    const totalContent = blogs.length + projects.length + services.length;

    return {
      totalContent,
      publishedCount,
      draftCount,
      cards: [
        {
          title: "Toplam Blog",
          value: blogs.length,
          icon: "bi-journal-text",
          description: `${publishedBlogs} yazı yayında`,
          descriptionClass: "text-success",
          trend: calculateTrend(blogs),
          trendLabel: "Son 7 gün",
        },
        {
          title: "Toplam Proje",
          value: projects.length,
          icon: "bi-folder2-open",
          description: `${publishedProjects} proje yayında`,
          descriptionClass: "text-success",
          trend: calculateTrend(projects),
          trendLabel: "Son 7 gün",
        },
        {
          title: "Toplam Hizmet", // <-- YENİ EKLENDİ
          value: services.length,
          icon: "bi-gear-wide-connected",
          description: `${activeServices} hizmet aktif`,
          descriptionClass: "text-info",
          trend: calculateTrend(services),
          trendLabel: "Hizmet altyapısı",
        },
        {
          title: "Yayındaki İçerik",
          value: publishedCount,
          icon: "bi-check-circle",
          description: "Ziyaretçilere açık",
          descriptionClass: "text-success",
          trendLabel: "Aktif yayınlar",
        },
        {
          title: "Taslak İçerik",
          value: draftCount,
          icon: "bi-file-earmark-text",
          description: "Yayınlanmayı bekliyor",
          descriptionClass: "text-warning",
          trendLabel: "İnceleme gerekli",
        },
        {
          title: "Son Güncelleme",
          value: formatShortDate(lastUpdatedAt),
          icon: "bi-clock-history",
          description: formatTime(lastUpdatedAt),
          descriptionClass: "text-secondary",
          trendLabel: "Son içerik işlemi",
        },
      ],
    };
  }, [blogs, projects, services]);

  const recentContents = useMemo(() => {
    const blogContents = blogs.map((blog) => ({
      id: `blog-${blog.id}`,
      title: blog.title || "Başlıksız blog",
      type: "Blog",
      status: blog.status,
      date: blog.updatedAt || blog.createdAt,
      editPath: `/admin/blog/${blog.id}`,
    }));

    const projectContents = projects.map((project) => ({
      id: `project-${project.id}`,
      title: project.title || "Başlıksız proje",
      type: "Proje",
      status: project.status,
      date: project.updatedAt || project.createdAt,
      editPath: `/admin/projeler/${project.id}/duzenle`,
    }));

    const serviceContents = services.map((service) => ({
      id: `service-${service.id}`,
      title: service.title || "Başlıksız hizmet",
      type: "Hizmet",
      status: service.status,
      date: service.createdAt,
      editPath: `/admin/hizmetler`,
    }));

    return [...blogContents, ...projectContents, ...serviceContents]
      .sort((firstItem, secondItem) => {
        const firstDate = getValidDate(firstItem.date)?.getTime() ?? 0;
        const secondDate = getValidDate(secondItem.date)?.getTime() ?? 0;
        return secondDate - firstDate;
      })
      .slice(0, RECENT_CONTENT_LIMIT);
  }, [blogs, projects, services]);

  const activities = useMemo(() => {
    const blogActivities = blogs.map((blog) => ({
      id: `activity-blog-${blog.id}`,
      type: "blog",
      title:
        blog.status === "published"
          ? "Blog yazısı yayında"
          : "Blog yazısı güncellendi",
      description: blog.title || "Başlıksız blog",
      date: blog.updatedAt || blog.createdAt,
      path: `/admin/blog/${blog.id}`,
    }));

    const projectActivities = projects.map((project) => ({
      id: `activity-project-${project.id}`,
      type: "project",
      title:
        project.status === "published"
          ? "Proje yayına alındı"
          : "Proje güncellendi",
      description: project.title || "Başlıksız proje",
      date: project.updatedAt || project.createdAt,
      path: `/admin/projeler/${project.id}/duzenle`,
    }));

    const serviceActivities = services.map((service) => ({
      id: `activity-service-${service.id}`,
      type: "system",
      title: "Hizmet kaydı",
      description: service.title || "Başlıksız hizmet",
      date: service.createdAt,
      path: `/admin/hizmetler`,
    }));

    return [...blogActivities, ...projectActivities, ...serviceActivities]
      .sort((firstActivity, secondActivity) => {
        const firstDate = getValidDate(firstActivity.date)?.getTime() ?? 0;
        const secondDate = getValidDate(secondActivity.date)?.getTime() ?? 0;
        return secondDate - firstDate;
      })
      .slice(0, ACTIVITY_LIMIT);
  }, [blogs, projects, services]);

  if (isLoading) {
    return (
      <section>
        <div className="mb-4">
          <h1 className="h3 fw-bold mb-1">Dashboard</h1>
          <p className="text-secondary mb-0">
            Dashboard verileri hazırlanıyor.
          </p>
        </div>
        <DashboardSkeleton />
      </section>
    );
  }

  return (
    <section className="premium-dashboard">
      <DashboardWelcome
        adminName="Yönetici"
        totalContent={statistics.totalContent}
        publishedContent={statistics.publishedCount}
        draftContent={statistics.draftCount}
      />

      <div className="row g-4 mt-1">
        {statistics.cards.map((card) => (
          <div className="col-12 col-sm-6 col-xl-4" key={card.title}>
            <DashboardStatCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              description={card.description}
              descriptionClass={card.descriptionClass}
              trend={card.trend}
              trendLabel={card.trendLabel}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <DashboardCharts
          blogCount={blogs.length}
          projectCount={projects.length}
          publishedCount={statistics.publishedCount}
          draftCount={statistics.draftCount}
        />
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12 col-xl-7">
          <section className="dashboard-panel h-100">
            <div className="dashboard-panel__header">
              <div>
                <span className="dashboard-panel__eyebrow">
                  İçerik Yönetimi
                </span>
                <h2 className="h5 fw-bold mb-1">Son İçerikler</h2>
                <p className="text-secondary mb-0">
                  Yakın zamanda eklenen veya güncellenen içerikler
                </p>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <Link
                  to="/admin/blog"
                  className="btn btn-sm btn-outline-secondary"
                >
                  Bloglar
                </Link>
                <Link
                  to="/admin/projeler"
                  className="btn btn-sm btn-outline-secondary"
                >
                  Projeler
                </Link>
                <Link
                  to="/admin/hizmetler"
                  className="btn btn-sm btn-outline-secondary"
                >
                  Hizmetler
                </Link>
              </div>
            </div>

            {recentContents.length === 0 ? (
              <div className="dashboard-empty-state">
                <div className="dashboard-empty-state__icon">
                  <i className="bi bi-inbox" aria-hidden="true" />
                </div>
                <h3 className="h6">Henüz içerik bulunmuyor</h3>
                <p className="text-secondary mb-0">
                  Yeni bir blog yazısı veya proje ekleyerek başlayabilirsiniz.
                </p>
              </div>
            ) : (
              <div className="table-responsive mt-4">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Başlık</th>
                      <th>Tür</th>
                      <th>Durum</th>
                      <th>Tarih</th>
                      <th className="text-end">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContents.map((content) => (
                      <tr key={content.id}>
                        <td>
                          <div
                            className="fw-semibold text-truncate"
                            style={{ maxWidth: "240px" }}
                            title={content.title}
                          >
                            {content.title}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${content.type === "Blog" ? "text-bg-dark" : content.type === "Proje" ? "text-bg-primary" : "text-bg-info"}`}
                          >
                            {content.type}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${statusBadgeClasses[content.status] || "text-bg-secondary"}`}
                          >
                            {statusLabels[content.status] ||
                              content.status ||
                              "Belirsiz"}
                          </span>
                        </td>
                        <td className="text-nowrap">
                          {formatDate(content.date)}
                        </td>
                        <td className="text-end">
                          <Link
                            to={content.editPath}
                            className="btn btn-sm btn-outline-secondary"
                            aria-label={`${content.title} içeriğini düzenle`}
                          >
                            <i
                              className="bi bi-pencil-square"
                              aria-hidden="true"
                            />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div className="col-12 col-xl-5">
          <DashboardActivity activities={activities} />
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12">
          <section className="dashboard-panel">
            <div className="dashboard-panel__header">
              <div>
                <span className="dashboard-panel__eyebrow">Kısayollar</span>
                <h2 className="h5 fw-bold mb-1">Hızlı İşlemler</h2>
                <p className="text-secondary mb-0">
                  Sık kullanılan yönetim sayfalarına erişin
                </p>
              </div>
            </div>

            <div className="dashboard-quick-actions mt-4">
              <Link to="/admin/blog/yeni" className="dashboard-quick-action">
                <span className="dashboard-quick-action__icon">
                  <i className="bi bi-file-earmark-plus" aria-hidden="true" />
                </span>
                <span>
                  <strong>Yeni Blog</strong>
                  <small>Yeni bir blog yazısı oluştur</small>
                </span>
                <i
                  className="bi bi-arrow-right dashboard-quick-action__arrow"
                  aria-hidden="true"
                />
              </Link>

              <Link
                to="/admin/projeler/yeni"
                className="dashboard-quick-action"
              >
                <span className="dashboard-quick-action__icon">
                  <i className="bi bi-folder-plus" aria-hidden="true" />
                </span>
                <span>
                  <strong>Yeni Proje</strong>
                  <small>Portföye yeni proje ekle</small>
                </span>
                <i
                  className="bi bi-arrow-right dashboard-quick-action__arrow"
                  aria-hidden="true"
                />
              </Link>

              <Link to="/admin/hizmetler" className="dashboard-quick-action">
                <span className="dashboard-quick-action__icon">
                  <i className="bi bi-gear" aria-hidden="true" />
                </span>
                <span>
                  <strong>Hizmet Yönetimi</strong>
                  <small>Hizmet içeriklerini düzenle ve ekle</small>
                </span>
                <i
                  className="bi bi-arrow-right dashboard-quick-action__arrow"
                  aria-hidden="true"
                />
              </Link>

              <Link to="/admin/mesajlar" className="dashboard-quick-action">
                <span className="dashboard-quick-action__icon">
                  <i className="bi bi-envelope-open" aria-hidden="true" />
                </span>
                <span>
                  <strong>Mesajlar</strong>
                  <small>İletişim mesajlarını görüntüle</small>
                </span>
                <i
                  className="bi bi-arrow-right dashboard-quick-action__arrow"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;

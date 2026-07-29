// src/pages/admin/Projects/ProjectListPage.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import DeleteModal from "../../../components/admin/project/DeleteModal";
import ProjectFilters from "../../../components/admin/project/ProjectFilters";
import ProjectTable from "../../../components/admin/project/ProjectTable";
import projectService from "../../../services/projectService";

const ITEMS_PER_PAGE = 5;

const ProjectListPage = () => {
  const [projects, setProjects] = useState(() => projectService.getAll());
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.toLocaleLowerCase("tr-TR").trim();

    return projects.filter((project) => {
      const searchableContent = [
        project.title,
        project.summary,
        project.description,
        project.client,
        project.category,
        ...(project.technologies || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("tr-TR");

      const matchesSearch =
        !normalizedSearch || searchableContent.includes(normalizedSearch);

      const matchesCategory =
        category === "all" || project.category === category;

      const matchesStatus = status === "all" || project.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, searchTerm, category, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProjects = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, safeCurrentPage]);

  const firstVisibleItem =
    filteredProjects.length === 0
      ? 0
      : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;

  const lastVisibleItem = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    filteredProjects.length,
  );

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setStatus("all");
    setCurrentPage(1);
  };

  const handleDeleteRequest = (project) => {
    setSelectedProject(project);
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setSelectedProject(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) {
      return;
    }

    setIsDeleting(true);

    try {
      const deleted = projectService.remove(selectedProject.id);

      if (!deleted) {
        toast.error("Silinecek proje bulunamadı.");
        return;
      }

      setProjects(projectService.getAll());
      setSelectedProject(null);
      toast.success("Proje başarıyla silindi.");
    } catch {
      toast.error("Proje silinirken bir hata oluştu.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderPaginationItems = () => {
    return Array.from({ length: totalPages }, (_, index) => {
      const pageNumber = index + 1;

      return (
        <li
          key={pageNumber}
          className={`page-item ${
            safeCurrentPage === pageNumber ? "active" : ""
          }`}
        >
          <button
            type="button"
            className="page-link"
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </button>
        </li>
      );
    });
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Proje Yönetimi</h1>

          <p className="text-secondary mb-0">
            Portföy projelerini görüntüleyin, düzenleyin ve yönetin.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link
            to="/admin"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
          >
            <i className="bi bi-speedometer2" />
            <span>Dashboard'a Dön</span>
          </Link>

          <Link
            to="/admin/projeler/yeni"
            className="btn btn-dark btn-sm d-flex align-items-center gap-1"
          >
            <i className="bi bi-plus-lg" />
            <span>Yeni Proje</span>
          </Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1">Toplam Proje</p>
                  <h2 className="h4 mb-0">{projects.length}</h2>
                </div>

                <div className="fs-2 text-secondary">
                  <i className="bi bi-folder2-open" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1">Yayındaki Projeler</p>
                  <h2 className="h4 mb-0">
                    {
                      projects.filter(
                        (project) => project.status === "published",
                      ).length
                    }
                  </h2>
                </div>

                <div className="fs-2 text-success">
                  <i className="bi bi-check-circle" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1">Taslak Projeler</p>
                  <h2 className="h4 mb-0">
                    {
                      projects.filter((project) => project.status === "draft")
                        .length
                    }
                  </h2>
                </div>

                <div className="fs-2 text-secondary">
                  <i className="bi bi-file-earmark-text" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1">Öne Çıkanlar</p>
                  <h2 className="h4 mb-0">
                    {
                      projects.filter((project) => project.featured === true)
                        .length
                    }
                  </h2>
                </div>

                <div className="fs-2 text-warning">
                  <i className="bi bi-star-fill" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProjectFilters
        searchTerm={searchTerm}
        category={category}
        status={status}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilters}
      />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
        <p className="text-secondary mb-0">
          {filteredProjects.length} proje bulundu
        </p>

        {filteredProjects.length > 0 && (
          <small className="text-secondary">
            {firstVisibleItem}-{lastVisibleItem} arası gösteriliyor
          </small>
        )}
      </div>

      <ProjectTable
        projects={paginatedProjects}
        onDelete={handleDeleteRequest}
      />

      {totalPages > 1 && (
        <nav
          className="d-flex justify-content-center mt-4"
          aria-label="Proje sayfalama"
        >
          <ul className="pagination mb-0">
            <li
              className={`page-item ${safeCurrentPage === 1 ? "disabled" : ""}`}
            >
              <button
                type="button"
                className="page-link"
                disabled={safeCurrentPage === 1}
                onClick={() =>
                  setCurrentPage((previousPage) =>
                    Math.max(previousPage - 1, 1),
                  )
                }
              >
                Önceki
              </button>
            </li>

            {renderPaginationItems()}

            <li
              className={`page-item ${
                safeCurrentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                type="button"
                className="page-link"
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  setCurrentPage((previousPage) =>
                    Math.min(previousPage + 1, totalPages),
                  )
                }
              >
                Sonraki
              </button>
            </li>
          </ul>
        </nav>
      )}

      <DeleteModal
        project={selectedProject}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProjectListPage;

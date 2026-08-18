import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/api/projects", { params: { page: 1, pageSize: 50 } })
      .then((res) => setProjects(res.data.items ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-dark text-light py-5">
        <div className="container py-4">
          <span className="badge rounded-pill bg-primary mb-3">Portföy</span>
          <h1 className="display-5 fw-bold mb-3">Projelerimiz</h1>
          <p className="lead text-white-50 mb-0" style={{ maxWidth: 600 }}>
            Tamamladığımız yenilikçi projeleri keşfedin.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-folder2-open" style={{ fontSize: 48 }} />
              <p className="mt-3">Henüz proje eklenmemiş.</p>
            </div>
          ) : (
            <div className="row g-4">
              {projects.map((project) => (
                <div className="col-md-6 col-lg-4" key={project.id}>
                  <div className="card h-100 border-0 shadow-sm overflow-hidden">
                    {project.coverImage && (
                      <Link to={`/projeler/${project.id}`}>
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="card-img-top"
                          style={{ height: 200, objectFit: "cover" }}
                        />
                      </Link>
                    )}
                    <div className="card-body p-4">
                      {project.category && (
                        <span className="badge bg-primary bg-opacity-10 text-primary mb-2">
                          {project.category}
                        </span>
                      )}
                      <Link to={`/projeler/${project.id}`} className="text-decoration-none text-dark">
                        <h2 className="h5 fw-bold">{project.title}</h2>
                      </Link>
                      <p className="text-secondary small mb-3">{project.summary}</p>
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-box-arrow-up-right me-1" />
                          Projeye Git
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default ProjectsPage;

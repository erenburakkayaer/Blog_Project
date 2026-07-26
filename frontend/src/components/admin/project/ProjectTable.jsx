import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const statusLabels = {
  published: "Yayında",
  draft: "Taslak",
};

const statusClasses = {
  published: "text-bg-success",
  draft: "text-bg-secondary",
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateValue));
};

const ProjectTable = ({ projects, onDelete }) => {
  if (projects.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body py-5 text-center">
          <i className="bi bi-folder-x display-4 text-secondary" />

          <h2 className="h5 mt-3">Proje bulunamadı</h2>

          <p className="text-secondary mb-0">
            Arama veya filtre kriterlerini değiştirerek tekrar deneyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col">Proje</th>
              <th scope="col">Kategori</th>
              <th scope="col">Müşteri</th>
              <th scope="col">Durum</th>
              <th scope="col">Güncellenme</th>
              <th scope="col" className="text-end">
                İşlemler
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td style={{ minWidth: "260px" }}>
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="rounded object-fit-cover"
                      width="72"
                      height="52"
                    />

                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <strong>{project.title}</strong>

                        {project.featured && (
                          <span
                            className="badge text-bg-warning"
                            title="Öne çıkan proje"
                          >
                            <i className="bi bi-star-fill" />
                          </span>
                        )}
                      </div>

                      <small className="text-secondary">
                        {project.summary || "Açıklama bulunmuyor."}
                      </small>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="badge text-bg-light border">
                    {project.category}
                  </span>
                </td>

                <td>{project.client || "-"}</td>

                <td>
                  <span
                    className={`badge ${
                      statusClasses[project.status] || "text-bg-secondary"
                    }`}
                  >
                    {statusLabels[project.status] || project.status}
                  </span>
                </td>

                <td>{formatDate(project.updatedAt)}</td>

                <td className="text-end">
                  <div className="btn-group" role="group">
                    <Link
                      to={`/admin/projeler/${project.id}/duzenle`}
                      className="btn btn-sm btn-outline-primary"
                      title="Projeyi düzenle"
                    >
                      <i className="bi bi-pencil-square" />
                    </Link>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      title="Projeyi sil"
                      onClick={() => onDelete(project)}
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ProjectTable.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      client: PropTypes.string,
      status: PropTypes.string.isRequired,
      featured: PropTypes.bool,
      coverImage: PropTypes.string,
      summary: PropTypes.string,
      updatedAt: PropTypes.string,
    }),
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProjectTable;

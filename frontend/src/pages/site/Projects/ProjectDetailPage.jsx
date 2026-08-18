import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../../../api/apiClient";

function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await apiClient.get(`/api/projects/${id}`);
        setProject(res.data);
      } catch {
        toast.error("Proje yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-5">
        <h2>Proje bulunamadı.</h2>
        <Link to="/projeler" className="btn btn-primary mt-3">Projelerimize Dön</Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-dark text-light py-5">
        <div className="container py-4 text-center">
          <span className="badge bg-primary mb-3">{project.category}</span>
          <h1 className="display-4 fw-bold">{project.title}</h1>
          <p className="lead text-white-50 mt-3 mx-auto" style={{ maxWidth: 700 }}>
            {project.summary}
          </p>
          {project.projectUrl && (
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light mt-4 px-4">
              <i className="bi bi-box-arrow-up-right me-2" />
              Projeyi İncele
            </a>
          )}
        </div>
      </section>

      {project.coverImage && (
        <section className="py-4 bg-light">
          <div className="container text-center">
            <img src={project.coverImage} alt={project.title} className="img-fluid rounded shadow" style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }} />
          </div>
        </section>
      )}

      <section className="py-5">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="fs-5" dangerouslySetInnerHTML={{ __html: project.description }} />
          
          <div className="mt-5 text-center">
            <Link to="/teklif-al" className="btn btn-primary btn-lg px-5">
              Benzer Bir Proje Başlatın
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProjectDetailPage;

import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProjectForm from "../../../components/admin/project/ProjectForm";
import projectService from "../../../services/projectService";

const ProjectEditPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    projectService
      .getById(projectId)
      .then(setProject)
      .catch(() => setNotFound(true));
  }, [projectId]);

  const handleUpdateProject = async (projectData) => {
    try {
      await projectService.update(projectId, projectData);

      toast.success("Proje başarıyla güncellendi.");
      navigate("/admin/projeler");
    } catch {
      toast.error("Proje güncellenirken bir hata oluştu.");
    }
  };

  if (notFound) {
    return <Navigate to="/admin/projeler" replace />;
  }

  if (!project) {
    return null;
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Projeyi Düzenle</h1>

          <p className="text-secondary mb-0">
            {project.title} projesinin bilgilerini güncelleyin.
          </p>
        </div>

        <Link to="/admin/projeler" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2" />
          Projelere Dön
        </Link>
      </div>

      <ProjectForm
        initialValues={project}
        onSubmit={handleUpdateProject}
        submitButtonText="Değişiklikleri Kaydet"
      />
    </div>
  );
};

export default ProjectEditPage;

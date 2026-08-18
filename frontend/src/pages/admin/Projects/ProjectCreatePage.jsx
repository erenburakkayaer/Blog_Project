import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ProjectForm from "../../../components/admin/project/ProjectForm";
import projectService from "../../../services/projectService";

const ProjectCreatePage = () => {
  const navigate = useNavigate();

  const handleCreateProject = async (projectData) => {
    try {
      await projectService.create(projectData);

      toast.success("Proje başarıyla oluşturuldu.");
      navigate("/admin/projeler");
    } catch {
      toast.error("Proje oluşturulurken bir hata oluştu.");
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Yeni Proje</h1>

          <p className="text-secondary mb-0">
            Portföye eklenecek yeni proje bilgilerini girin.
          </p>
        </div>

        <Link to="/admin/projeler" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2" />
          Projelere Dön
        </Link>
      </div>

      <ProjectForm
        onSubmit={handleCreateProject}
        submitButtonText="Projeyi Oluştur"
      />
    </div>
  );
};

export default ProjectCreatePage;

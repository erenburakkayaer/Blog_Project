import apiClient from "../api/apiClient";

const getAll = async () => {
  const response = await apiClient.get("/api/projects", {
    params: { page: 1, pageSize: 100 },
  });

  return response.data.items;
};

const getById = async (id) => {
  const response = await apiClient.get(`/api/projects/${id}`);
  return response.data;
};

const toPayload = (projectData) => ({
  title: projectData.title.trim(),
  summary: projectData.summary.trim(),
  description: projectData.description?.trim() || "",
  client: projectData.client?.trim() || "",
  category: projectData.category,
  technologies: projectData.technologies || [],
  coverImage: projectData.coverImage?.trim() || "",
  projectUrl: projectData.projectUrl?.trim() || "",
  repositoryUrl: projectData.repositoryUrl?.trim() || "",
  startDate: projectData.startDate || null,
  endDate: projectData.endDate || null,
  status: projectData.status,
  featured: Boolean(projectData.featured),
});

const create = async (projectData) => {
  const response = await apiClient.post("/api/projects", toPayload(projectData));
  return response.data;
};

const update = async (id, projectData) => {
  await apiClient.put(`/api/projects/${id}`, toPayload(projectData));
  return true;
};

const remove = async (id) => {
  await apiClient.delete(`/api/projects/${id}`);
  return true;
};

const projectService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default projectService;

import apiClient from "../api/apiClient";

const getAll = async () => {
  const response = await apiClient.get("/api/blogs", {
    params: { page: 1, pageSize: 100 },
  });

  return response.data.items;
};

const getById = async (id) => {
  const response = await apiClient.get(`/api/blogs/${id}`);
  return response.data;
};

const create = async (blogData) => {
  const response = await apiClient.post("/api/blogs", {
    title: blogData.title.trim(),
    summary: blogData.summary.trim(),
    content: blogData.content.trim(),
    coverImage: blogData.coverImage?.trim() || "",
    category: blogData.category,
    status: blogData.status,
  });

  return response.data;
};

const update = async (id, blogData) => {
  await apiClient.put(`/api/blogs/${id}`, {
    title: blogData.title.trim(),
    summary: blogData.summary.trim(),
    content: blogData.content.trim(),
    coverImage: blogData.coverImage?.trim() || "",
    category: blogData.category,
    status: blogData.status,
  });

  return true;
};

const remove = async (id) => {
  await apiClient.delete(`/api/blogs/${id}`);
  return true;
};

export const blogService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

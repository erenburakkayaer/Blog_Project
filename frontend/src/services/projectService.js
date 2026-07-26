import projects from "../data/projects";

const STORAGE_KEY = "technova_projects";

const cloneProjects = (items) =>
  items.map((project) => ({
    ...project,
    technologies: [...(project.technologies || [])],
  }));

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const createSlug = (value) =>
  value
    .toLocaleLowerCase("tr-TR")
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const readProjects = () => {
  try {
    const storedProjects = localStorage.getItem(STORAGE_KEY);

    if (!storedProjects) {
      const initialProjects = cloneProjects(projects);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));

      return initialProjects;
    }

    const parsedProjects = JSON.parse(storedProjects);

    return Array.isArray(parsedProjects)
      ? cloneProjects(parsedProjects)
      : cloneProjects(projects);
  } catch {
    return cloneProjects(projects);
  }
};

const writeProjects = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const getAll = () => {
  return readProjects().sort(
    (firstProject, secondProject) =>
      new Date(secondProject.updatedAt) - new Date(firstProject.updatedAt),
  );
};

const getById = (id) => {
  return readProjects().find((project) => project.id === id) || null;
};

const create = (projectData) => {
  const currentProjects = readProjects();
  const now = new Date().toISOString();

  const newProject = {
    ...projectData,
    id: generateId(),
    slug: createSlug(projectData.title),
    technologies: projectData.technologies || [],
    createdAt: now,
    updatedAt: now,
  };

  const updatedProjects = [newProject, ...currentProjects];

  writeProjects(updatedProjects);

  return newProject;
};

const update = (id, projectData) => {
  const currentProjects = readProjects();
  const projectIndex = currentProjects.findIndex(
    (project) => project.id === id,
  );

  if (projectIndex === -1) {
    return null;
  }

  const updatedProject = {
    ...currentProjects[projectIndex],
    ...projectData,
    id,
    slug: createSlug(projectData.title),
    technologies: projectData.technologies || [],
    updatedAt: new Date().toISOString(),
  };

  currentProjects[projectIndex] = updatedProject;
  writeProjects(currentProjects);

  return updatedProject;
};

const remove = (id) => {
  const currentProjects = readProjects();
  const updatedProjects = currentProjects.filter(
    (project) => project.id !== id,
  );

  if (updatedProjects.length === currentProjects.length) {
    return false;
  }

  writeProjects(updatedProjects);

  return true;
};

const reset = () => {
  const initialProjects = cloneProjects(projects);

  writeProjects(initialProjects);

  return initialProjects;
};

const projectService = {
  getAll,
  getById,
  create,
  update,
  remove,
  reset,
};

export default projectService;

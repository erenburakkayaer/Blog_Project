import { blogs as initialBlogs } from "../data/blogs";

const STORAGE_KEY = "technova_blogs";
const REQUEST_DELAY = 400;

const wait = (duration = REQUEST_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const getStoredBlogs = () => {
  const storedBlogs = localStorage.getItem(STORAGE_KEY);

  if (!storedBlogs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBlogs));
    return [...initialBlogs];
  }

  try {
    return JSON.parse(storedBlogs);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBlogs));
    return [...initialBlogs];
  }
};

const saveBlogs = (blogs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
};

const createSlug = (text) =>
  text
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

const getAll = async () => {
  await wait();

  const blogs = getStoredBlogs();

  return [...blogs].sort(
    (firstBlog, secondBlog) =>
      new Date(secondBlog.createdAt) - new Date(firstBlog.createdAt),
  );
};

const getById = async (id) => {
  await wait();

  const blogs = getStoredBlogs();
  const blog = blogs.find((item) => item.id === Number(id));

  if (!blog) {
    throw new Error("Blog yazısı bulunamadı.");
  }

  return blog;
};

const create = async (blogData) => {
  await wait();

  const blogs = getStoredBlogs();
  const now = new Date().toISOString();

  const newBlog = {
    id: Date.now(),
    title: blogData.title.trim(),
    slug: createSlug(blogData.title),
    category: blogData.category,
    author: blogData.author?.trim() || "Admin",
    coverImage: blogData.coverImage?.trim() || "",
    summary: blogData.summary.trim(),
    content: blogData.content.trim(),
    status: blogData.status,
    createdAt: now,
    updatedAt: now,
  };

  const updatedBlogs = [newBlog, ...blogs];
  saveBlogs(updatedBlogs);

  return newBlog;
};

const update = async (id, blogData) => {
  await wait();

  const blogs = getStoredBlogs();
  const blogIndex = blogs.findIndex((item) => item.id === Number(id));

  if (blogIndex === -1) {
    throw new Error("Güncellenecek blog yazısı bulunamadı.");
  }

  const updatedBlog = {
    ...blogs[blogIndex],
    ...blogData,
    id: blogs[blogIndex].id,
    title: blogData.title.trim(),
    slug: createSlug(blogData.title),
    author: blogData.author?.trim() || "Admin",
    coverImage: blogData.coverImage?.trim() || "",
    summary: blogData.summary.trim(),
    content: blogData.content.trim(),
    updatedAt: new Date().toISOString(),
  };

  blogs[blogIndex] = updatedBlog;
  saveBlogs(blogs);

  return updatedBlog;
};

const remove = async (id) => {
  await wait();

  const blogs = getStoredBlogs();
  const blogExists = blogs.some((item) => item.id === Number(id));

  if (!blogExists) {
    throw new Error("Silinecek blog yazısı bulunamadı.");
  }

  const updatedBlogs = blogs.filter((item) => item.id !== Number(id));
  saveBlogs(updatedBlogs);

  return true;
};

const reset = async () => {
  await wait();

  saveBlogs(initialBlogs);
  return [...initialBlogs];
};

export const blogService = {
  getAll,
  getById,
  create,
  update,
  remove,
  reset,
};

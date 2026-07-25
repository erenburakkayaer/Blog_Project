import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import BlogFilters from "../../../components/admin/blog/BlogFilters";
import BlogTable from "../../../components/admin/blog/BlogTable";
import DeleteModal from "../../../components/admin/blog/DeleteModal";
import { blogService } from "../../../services/blogService";

const BLOGS_PER_PAGE = 4;

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true);

        const blogList = await blogService.getAll();

        setBlogs(blogList);
      } catch (error) {
        toast.error(error.message || "Blog yazıları yüklenemedi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = blogs.map((blog) => blog.category).filter(Boolean);

    return [...new Set(uniqueCategories)].sort(
      (firstCategory, secondCategory) =>
        firstCategory.localeCompare(secondCategory, "tr-TR"),
    );
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase("tr-TR");

    return blogs.filter((blog) => {
      const title = blog.title?.toLocaleLowerCase("tr-TR") || "";
      const author = blog.author?.toLocaleLowerCase("tr-TR") || "";

      const matchesSearch =
        normalizedSearchTerm === "" ||
        title.includes(normalizedSearchTerm) ||
        author.includes(normalizedSearchTerm);

      const matchesCategory =
        selectedCategory === "all" || blog.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || blog.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogs, searchTerm, selectedCategory, selectedStatus]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / BLOGS_PER_PAGE),
  );

  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    const endIndex = startIndex + BLOGS_PER_PAGE;

    return filteredBlogs.slice(startIndex, endIndex);
  }, [filteredBlogs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  const handleDeleteRequest = (blog) => {
    setSelectedBlog(blog);
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setSelectedBlog(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBlog) {
      return;
    }

    try {
      setIsDeleting(true);

      await blogService.remove(selectedBlog.id);

      setBlogs((currentBlogs) =>
        currentBlogs.filter((blog) => blog.id !== selectedBlog.id),
      );

      toast.success("Blog yazısı başarıyla silindi.");
      setSelectedBlog(null);
    } catch (error) {
      toast.error(error.message || "Blog yazısı silinemedi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) {
      return;
    }

    setCurrentPage(pageNumber);
  };

  const publishedBlogCount = blogs.filter(
    (blog) => blog.status === "published",
  ).length;

  const draftBlogCount = blogs.filter((blog) => blog.status === "draft").length;

  const firstVisibleItem =
    filteredBlogs.length === 0 ? 0 : (currentPage - 1) * BLOGS_PER_PAGE + 1;

  const lastVisibleItem = Math.min(
    currentPage * BLOGS_PER_PAGE,
    filteredBlogs.length,
  );

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Blog Yönetimi</h1>

          <p className="text-muted mb-0">
            Blog yazılarını görüntüleyebilir, oluşturabilir ve
            düzenleyebilirsiniz.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <span className="badge rounded-pill text-bg-dark px-3 py-2">
            Toplam: {blogs.length}
          </span>

          <span className="badge rounded-pill text-bg-success px-3 py-2">
            Yayında: {publishedBlogCount}
          </span>

          <span className="badge rounded-pill text-bg-warning px-3 py-2">
            Taslak: {draftBlogCount}
          </span>
        </div>
      </div>

      <BlogFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        categories={categories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setSelectedStatus}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body py-5 text-center">
            <div
              className="spinner-border text-dark"
              role="status"
              aria-label="Blog yazıları yükleniyor"
            />

            <p className="text-muted mt-3 mb-0">Blog yazıları yükleniyor...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <small className="text-muted">
              {filteredBlogs.length === 0
                ? "Blog yazısı bulunamadı."
                : `${firstVisibleItem}-${lastVisibleItem} arası gösteriliyor. Toplam ${filteredBlogs.length} blog yazısı.`}
            </small>

            {totalPages > 1 && (
              <small className="text-muted">
                Sayfa {currentPage} / {totalPages}
              </small>
            )}
          </div>

          <BlogTable blogs={paginatedBlogs} onDelete={handleDeleteRequest} />

          {totalPages > 1 && (
            <nav
              className="d-flex justify-content-end mt-4"
              aria-label="Blog sayfalama"
            >
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Önceki
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <li
                      key={pageNumber}
                      className={`page-item ${
                        currentPage === pageNumber ? "active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sonraki
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}

      <DeleteModal
        blog={selectedBlog}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default BlogListPage;

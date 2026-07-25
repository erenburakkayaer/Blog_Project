import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import BlogFilters from "../../../components/admin/blog/BlogFilters";
import BlogTable from "../../../components/admin/blog/BlogTable";
import DeleteModal from "../../../components/admin/blog/DeleteModal";

import {
  EmptyState,
  LoadingState,
  PageHeader,
  Pagination,
} from "../../../components/ui";

import { blogService } from "../../../services/blogService";

const BLOGS_PER_PAGE = 4;

const BlogListPage = () => {
  const navigate = useNavigate();

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

        setBlogs(Array.isArray(blogList) ? blogList : []);
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

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * BLOGS_PER_PAGE;
    const endIndex = startIndex + BLOGS_PER_PAGE;

    return filteredBlogs.slice(startIndex, endIndex);
  }, [filteredBlogs, safeCurrentPage]);

  const publishedBlogCount = useMemo(
    () => blogs.filter((blog) => blog.status === "published").length,
    [blogs],
  );

  const draftBlogCount = useMemo(
    () => blogs.filter((blog) => blog.status === "draft").length,
    [blogs],
  );

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedStatus !== "all";

  const firstVisibleItem =
    filteredBlogs.length === 0 ? 0 : (safeCurrentPage - 1) * BLOGS_PER_PAGE + 1;

  const lastVisibleItem = Math.min(
    safeCurrentPage * BLOGS_PER_PAGE,
    filteredBlogs.length,
  );

  const handleCreateBlog = () => {
    navigate("/admin/blog/yeni");
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

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
    if (
      pageNumber < 1 ||
      pageNumber > totalPages ||
      pageNumber === safeCurrentPage
    ) {
      return;
    }

    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <PageHeader
        title="Blog Yönetimi"
        description="Blog yazılarını görüntüleyebilir, oluşturabilir ve düzenleyebilirsiniz."
        actionLabel="Yeni Blog Ekle"
        actionIcon="bi-plus-lg"
        onAction={handleCreateBlog}
      >
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
      </PageHeader>

      <BlogFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <LoadingState
              text="Blog yazıları yükleniyor..."
              minHeight="320px"
            />
          </div>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <EmptyState
              icon={hasActiveFilters ? "bi-search" : "bi-journal-text"}
              title={
                hasActiveFilters
                  ? "Arama kriterlerine uygun blog bulunamadı"
                  : "Henüz blog yazısı bulunmuyor"
              }
              description={
                hasActiveFilters
                  ? "Arama veya filtreleme kriterlerini değiştirerek tekrar deneyebilirsiniz."
                  : "İlk blog yazınızı oluşturarak içerik yönetimine başlayabilirsiniz."
              }
              actionLabel={
                hasActiveFilters ? "Filtreleri Temizle" : "Yeni Blog Ekle"
              }
              actionIcon={
                hasActiveFilters ? "bi-arrow-counterclockwise" : "bi-plus-lg"
              }
              onAction={
                hasActiveFilters ? handleClearFilters : handleCreateBlog
              }
            />
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <small className="text-muted">
              {firstVisibleItem}-{lastVisibleItem} arası gösteriliyor. Toplam{" "}
              {filteredBlogs.length} blog yazısı.
            </small>

            {totalPages > 1 && (
              <small className="text-muted">
                Sayfa {safeCurrentPage} / {totalPages}
              </small>
            )}
          </div>

          <BlogTable blogs={paginatedBlogs} onDelete={handleDeleteRequest} />

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            ariaLabel="Blog sayfalama"
          />
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

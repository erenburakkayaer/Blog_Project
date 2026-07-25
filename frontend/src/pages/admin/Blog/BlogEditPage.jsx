import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import BlogForm from "../../../components/admin/blog/BlogForm";
import { blogService } from "../../../services/blogService";

const BlogEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setIsLoading(true);

        const blogData = await blogService.getById(id);

        setBlog(blogData);
      } catch (error) {
        toast.error(error.message || "Blog yazısı yüklenemedi.");
        navigate("/admin/blog");
      } finally {
        setIsLoading(false);
      }
    };

    loadBlog();
  }, [id, navigate]);

  const handleUpdateBlog = async (formData) => {
    try {
      setIsSubmitting(true);

      await blogService.update(id, formData);

      toast.success("Blog yazısı başarıyla güncellendi.");
      navigate("/admin/blog");
    } catch (error) {
      toast.error(
        error.message || "Blog yazısı güncellenirken bir hata oluştu.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body py-5 text-center">
          <div
            className="spinner-border text-dark"
            role="status"
            aria-label="Blog yazısı yükleniyor"
          />

          <p className="text-muted mt-3 mb-0">Blog yazısı yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <Link to="/admin/blog" className="text-decoration-none text-muted">
              Blog Yönetimi
            </Link>

            <i className="bi bi-chevron-right small text-muted" />

            <span className="text-dark">Blog Düzenle</span>
          </div>

          <h1 className="h3 mb-1">Blog Yazısını Düzenle</h1>

          <p className="text-muted mb-0">
            Blog içeriğini, yayın durumunu ve kapak görselini güncelleyin.
          </p>
        </div>

        <Link to="/admin/blog" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2" />
          Blog Listesine Dön
        </Link>
      </div>

      <BlogForm
        initialValues={blog}
        onSubmit={handleUpdateBlog}
        isSubmitting={isSubmitting}
        submitButtonText="Değişiklikleri Kaydet"
      />
    </div>
  );
};

export default BlogEditPage;

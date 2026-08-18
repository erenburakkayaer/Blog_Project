import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import BlogForm from "../../../components/admin/blog/BlogForm";
import { blogService } from "../../../services/blogService";

const BlogCreatePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateBlog = async (formData) => {
    try {
      setIsSubmitting(true);

      await blogService.createBlog(formData);

      toast.success("Blog yazısı başarıyla oluşturuldu.");
      navigate("/admin/blog");
    } catch (error) {
      toast.error(
        error.message || "Blog yazısı oluşturulurken bir hata oluştu.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <Link to="/admin/blog" className="text-decoration-none text-muted">
              Blog Yönetimi
            </Link>

            <i className="bi bi-chevron-right small text-muted" />

            <span className="text-dark">Yeni Blog</span>
          </div>

          <h1 className="h3 mb-1">Yeni Blog Oluştur</h1>

          <p className="text-muted mb-0">
            Yeni bir blog yazısı oluşturun ve yayın durumunu belirleyin.
          </p>
        </div>

        <Link to="/admin/blog" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2" />
          Blog Listesine Dön
        </Link>
      </div>

      <BlogForm
        onSubmit={handleCreateBlog}
        isSubmitting={isSubmitting}
        submitButtonText="Blogu Oluştur"
      />
    </div>
  );
};

export default BlogCreatePage;

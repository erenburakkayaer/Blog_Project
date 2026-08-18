import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/api/blogs", { params: { page: 1, pageSize: 50, search: "" } })
      .then((res) => {
        // Yalnızca yayında olanları göster
        const published = (res.data.items ?? []).filter((b) => b.status === "published");
        setBlogs(published);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-dark text-light py-5">
        <div className="container py-4">
          <span className="badge rounded-pill bg-primary mb-3">İçerikler</span>
          <h1 className="display-5 fw-bold mb-3">Blog</h1>
          <p className="lead text-white-50 mb-0" style={{ maxWidth: 600 }}>
            Teknoloji dünyasından güncel içerikleri ve rehberleri keşfedin.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-journal-text" style={{ fontSize: 48 }} />
              <p className="mt-3">Henüz blog yazısı eklenmemiş.</p>
            </div>
          ) : (
            <div className="row g-4">
              {blogs.map((blog) => (
                <div className="col-md-6 col-lg-4" key={blog.id}>
                  <div className="card h-100 border-0 shadow-sm overflow-hidden">
                    {blog.coverImage && (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="card-img-top"
                        style={{ height: 200, objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-primary bg-opacity-10 text-primary">
                          {blog.category}
                        </span>
                        <small className="text-secondary">
                          {new Date(blog.createdAt).toLocaleDateString("tr-TR")}
                        </small>
                      </div>
                      <h2 className="h5 fw-bold">{blog.title}</h2>
                      <p className="text-secondary small mb-3 flex-grow-1">
                        {blog.summary}
                      </p>
                      <div className="d-flex align-items-center mt-3">
                        <div className="small fw-semibold text-dark">
                          {blog.author}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default BlogPage;

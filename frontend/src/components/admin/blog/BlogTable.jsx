// src/components/admin/blog/BlogTable.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const BlogTable = ({ blogs, onDelete }) => {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body py-5 text-center">
          <i
            className="bi bi-journal-text text-secondary"
            style={{ fontSize: "4rem" }}
          />

          <h4 className="mt-3">Blog bulunamadı</h4>

          <p className="text-muted mb-0">
            Arama veya filtre kriterlerine uygun blog yazısı bulunamadı.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col">Blog</th>
              <th scope="col">Kategori</th>
              <th scope="col">Yazar</th>
              <th scope="col">Durum</th>
              <th scope="col">Tarih</th>
              <th scope="col" className="text-end">
                İşlemler
              </th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td style={{ minWidth: "260px" }}>
                  <div className="d-flex align-items-center gap-3">
                    {blog.coverImage && (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        width={72}
                        height={52}
                        className="rounded object-fit-cover"
                      />
                    )}

                    <div>
                      <Link
                        to={`/admin/blog/${blog.id}`}
                        className="fw-semibold text-dark text-decoration-none d-block mb-1"
                      >
                        {blog.title}
                      </Link>

                      <small
                        className="text-muted text-truncate d-block"
                        style={{ maxWidth: "280px" }}
                      >
                        {blog.slug}
                      </small>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="badge text-bg-light border">
                    {blog.category || "Genel"}
                  </span>
                </td>

                <td className="text-secondary">{blog.author || "Admin"}</td>

                <td>
                  <span
                    className={`badge ${
                      blog.status === "published"
                        ? "text-bg-success"
                        : "text-bg-warning text-dark"
                    }`}
                  >
                    {blog.status === "published" ? "Yayında" : "Taslak"}
                  </span>
                </td>

                <td className="text-secondary text-nowrap">
                  {formatDate(blog.createdAt)}
                </td>

                <td className="text-end">
                  <div className="btn-group" role="group">
                    <Link
                      to={`/admin/blog/${blog.id}`}
                      className="btn btn-sm btn-outline-primary"
                      title="Blog yazısını düzenle"
                    >
                      <i className="bi bi-pencil-square" />
                    </Link>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(blog)}
                      title="Blog yazısını sil"
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

BlogTable.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
      category: PropTypes.string,
      author: PropTypes.string,
      status: PropTypes.string.isRequired,
      coverImage: PropTypes.string,
      createdAt: PropTypes.string,
    }),
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BlogTable;

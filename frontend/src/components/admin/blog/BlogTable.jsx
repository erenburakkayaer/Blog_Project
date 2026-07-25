import { Link } from "react-router-dom";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const BlogTable = ({ blogs, onDelete }) => {
  if (blogs.length === 0) {
    return (
      <div className="card shadow-sm border-0">
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
    <div className="card shadow-sm border-0">
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Blog</th>

              <th>Kategori</th>

              <th>Yazar</th>

              <th>Durum</th>

              <th>Tarih</th>

              <th className="text-end">İşlemler</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      width={70}
                      height={50}
                      className="rounded object-fit-cover me-3"
                    />

                    <div>
                      <div className="fw-semibold">{blog.title}</div>

                      <small className="text-muted">{blog.slug}</small>
                    </div>
                  </div>
                </td>

                <td>{blog.category}</td>

                <td>{blog.author}</td>

                <td>
                  {blog.status === "published" ? (
                    <span className="badge bg-success">Yayında</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Taslak</span>
                  )}
                </td>

                <td>{formatDate(blog.createdAt)}</td>

                <td>
                  <div className="d-flex justify-content-end gap-2">
                    <Link
                      to={`/admin/blog/${blog.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-pencil-square me-1" />
                      Düzenle
                    </Link>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(blog)}
                    >
                      <i className="bi bi-trash me-1" />
                      Sil
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

export default BlogTable;

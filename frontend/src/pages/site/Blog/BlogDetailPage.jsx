import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../../../api/apiClient";

function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ authorName: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await apiClient.get(`/api/blogs/${id}`);
        setBlog(res.data);
        // Yorumları çek (Endpoint varsayılan olarak yorum döndürmüyorsa ayrı çekiyoruz)
        const commentsRes = await apiClient.get(`/api/comments/blog/${id}`).catch(() => ({ data: [] }));
        setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
      } catch {
        toast.error("Blog yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post("/api/comments", {
        blogId: parseInt(id),
        authorName: commentForm.authorName,
        content: commentForm.content,
      });
      toast.success("Yorumunuz başarıyla gönderildi ve onay bekliyor!");
      setCommentForm({ authorName: "", content: "" });
    } catch {
      toast.error("Yorum gönderilirken hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-5">
        <h2>Blog bulunamadı.</h2>
        <Link to="/blog" className="btn btn-primary mt-3">Bloglara Dön</Link>
      </div>
    );
  }

  return (
    <>
      {blog.coverImage && (
        <section
          className="bg-dark text-light py-5"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${blog.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container py-5 text-center">
            <span className="badge bg-primary mb-3">{blog.category}</span>
            <h1 className="display-4 fw-bold">{blog.title}</h1>
            <div className="text-white-50 mt-3">
              <span className="me-3"><i className="bi bi-person me-1" /> {blog.author}</span>
              <span><i className="bi bi-calendar3 me-1" /> {new Date(blog.createdAt).toLocaleDateString("tr-TR")}</span>
            </div>
          </div>
        </section>
      )}

      {!blog.coverImage && (
        <section className="bg-dark text-light py-5">
          <div className="container py-5 text-center">
            <span className="badge bg-primary mb-3">{blog.category}</span>
            <h1 className="display-4 fw-bold">{blog.title}</h1>
          </div>
        </section>
      )}

      <section className="py-5">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="fs-5 mb-5" dangerouslySetInnerHTML={{ __html: blog.content }} />

          <hr className="my-5" />

          {/* YORUMLAR BÖLÜMÜ */}
          <div>
            <h3 className="fw-bold mb-4">Yorumlar ({comments.length})</h3>
            {comments.length === 0 ? (
              <p className="text-secondary">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
            ) : (
              <div className="mb-5">
                {comments.map((comment) => (
                  <div key={comment.id} className="card border-0 shadow-sm mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <strong className="text-primary">{comment.authorName}</strong>
                        <small className="text-secondary">{new Date(comment.createdAt).toLocaleDateString("tr-TR")}</small>
                      </div>
                      <p className="mb-0">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="card border-0 shadow-sm bg-light p-4 mt-4">
              <h4 className="fw-bold mb-3">Yorum Yap</h4>
              <form onSubmit={handleCommentSubmit}>
                <div className="mb-3">
                  <label className="form-label">Adınız</label>
                  <input
                    type="text"
                    className="form-control"
                    value={commentForm.authorName}
                    onChange={(e) => setCommentForm({ ...commentForm, authorName: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Yorumunuz</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={commentForm.content}
                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Gönderiliyor..." : "Yorumu Gönder"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogDetailPage;

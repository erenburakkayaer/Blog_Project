import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { blogService } from "../../../services/blogService";
import { communityService } from "../../../services/communityService";
import useAuth from "../../../hooks/useAuth";

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clapsCount, setClapsCount] = useState(148);
  const [isClapped, setIsClapped] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);

  // DM Modal
  const [showDmModal, setShowDmModal] = useState(false);
  const [dmText, setDmText] = useState("");

  // Comments
  const [comments, setComments] = useState([
    { id: 1, author: "Eren Demir", text: "Gerçekten çok açıklayıcı ve vizyoner bir yazı olmuş.", time: "1 gün önce" },
    { id: 2, author: "Merve Aydın", text: "Ekibimizle de paylaştım, harika içerik!", time: "2 gün önce" },
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const found = await blogService.getById(id);
        if (found) {
          setBlog(found);
          setIsFollowingAuthor(communityService.isFollowing(found.authorUsername || "zeynep_yazar"));
        }
      } catch (e) {
        console.warn("Blog yüklenemedi:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleClap = () => {
    setIsClapped(true);
    setClapsCount((c) => c + 1);
    toast.success("👏 Alkışınız yazara iletildi!", { duration: 1500 });
  };

  const handleFollowAuthor = () => {
    if (!user) {
      toast("Takip etmek için lütfen giriş yapınız.", { icon: "🔒" });
      navigate("/giris");
      return;
    }
    const next = communityService.toggleFollow("zeynep_yazar");
    setIsFollowingAuthor(next);
    toast.success(next ? "🎉 Yazar takip edildi!" : "Takipten çıkarıldı.");
  };

  const handleSendDm = (e) => {
    e.preventDefault();
    if (!dmText.trim()) return;
    if (!user) {
      toast("Mesaj göndermek için lütfen giriş yapınız.", { icon: "🔒" });
      navigate("/giris");
      return;
    }
    communityService.sendMessage("zeynep_yazar", dmText, { title: blog.title });
    toast.success(`✉️ Mesajınız yazara iletildi!`);
    setDmText("");
    setShowDmModal(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (!user) {
      toast("Yorum yapmak için lütfen giriş yapınız.", { icon: "🔒" });
      navigate("/giris");
      return;
    }
    setComments([
      ...comments,
      {
        id: Date.now(),
        author: user.fullName || "Samet Başkale",
        text: newCommentText.trim(),
        time: "Şimdi",
      },
    ]);
    setNewCommentText("");
    toast.success("💬 Yorumunuz yayınlandı!");
  };

  if (loading) {
    return (
      <div className="py-5 text-center bg-dark text-white" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary my-5" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-5 text-center bg-dark text-white" style={{ minHeight: "80vh" }}>
        <h2 className="fw-bold">Blog yazısı bulunamadı.</h2>
        <Link to="/blog" className="btn btn-primary rounded-pill mt-3 px-4">
          Tüm Yazılara Dön
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0f1d", color: "#f8fafc", minHeight: "100vh" }} className="py-5">
      <div className="container py-3" style={{ maxWidth: "860px" }}>
        {/* Navigation */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <Link to="/blog" className="text-white-50 text-decoration-none small">
            <i className="bi bi-arrow-left me-2" /> Tüm Blog Yazılarına Dön
          </Link>
          <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 rounded-pill px-3 py-1">
            {blog.categoryName || blog.category || "Teknoloji"}
          </span>
        </div>

        {/* Title & Metadata */}
        <h1 className="display-6 fw-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
          {blog.title}
        </h1>

        {/* Author Header Bar */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 rounded-4 mb-4 border border-secondary border-opacity-25" style={{ background: "rgba(15, 23, 42, 0.85)" }}>
          <div className="d-flex align-items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
              alt="Author"
              className="rounded-circle border border-2 border-primary object-fit-cover"
              style={{ width: "50px", height: "50px" }}
            />
            <div>
              <div className="d-flex align-items-center gap-2">
                <Link to="/profil/zeynep_yazar" className="fw-bold text-white text-decoration-none hover-text-primary">
                  {blog.authorName || "Zeynep Kaya"}
                </Link>
                <span className="badge bg-danger rounded-pill px-2 py-0 small" style={{ fontSize: "10px" }}>
                  🇹🇷 e-Devlet Onaylı
                </span>
              </div>
              <small className="text-white-50">
                {blog.readTime || "6 dk okuma"} • {new Date(blog.createdAt || Date.now()).toLocaleDateString("tr-TR")}
              </small>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${isFollowingAuthor ? "btn-outline-light" : "btn-primary"}`}
              onClick={handleFollowAuthor}
            >
              {isFollowingAuthor ? "Takip Ediliyor" : "Yazarı Takip Et"}
            </button>
            <button
              type="button"
              className="btn btn-outline-info btn-sm rounded-pill px-3 fw-semibold"
              onClick={() => setShowDmModal(true)}
            >
              <i className="bi bi-chat-dots me-1" /> Mesaj At
            </button>
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-4 overflow-hidden shadow-2xl mb-5 border border-secondary border-opacity-25">
          <img
            src={blog.coverImageUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"}
            alt={blog.title}
            className="w-100 object-fit-cover"
            style={{ maxHeight: "420px" }}
          />
        </div>

        {/* Content Body */}
        <div className="article-body fs-5 text-light opacity-90 lh-lg mb-5">
          <p className="lead text-white-50 mb-4">{blog.excerpt || blog.summary}</p>
          <p>{blog.content}</p>

          <div className="p-4 rounded-4 bg-dark bg-opacity-75 border border-secondary border-opacity-25 my-4">
            <h5 className="fw-bold text-white mb-2">💡 Öne Çıkan Not:</h5>
            <p className="small text-white-50 mb-0">
              Bu içerik TechNova Yazar Kazanç Programı kapsamında yayınlanmış olup tüm telif hakları yazara ve platforma aittir.
            </p>
          </div>
        </div>

        {/* Claps / Interaction Footer */}
        <div className="d-flex align-items-center justify-content-between p-3 rounded-pill bg-dark bg-opacity-75 border border-secondary border-opacity-25 mb-5">
          <button
            type="button"
            className="btn btn-outline-warning rounded-pill px-4 fw-bold"
            onClick={handleClap}
          >
            👏 {clapsCount} Alkış
          </button>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-light btn-sm rounded-circle p-2"
              title="Paylaş"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("🔗 Makale bağlantısı panoya kopyalandı!");
              }}
            >
              <i className="bi bi-share" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="card rounded-4 border border-secondary border-opacity-25 p-4 shadow-xl mb-5" style={{ background: "rgba(15, 23, 42, 0.95)" }}>
          <h5 className="fw-bold text-white mb-3">
            <i className="bi bi-chat-left-text me-2 text-primary" />
            Yorumlar ({comments.length})
          </h5>

          <form onSubmit={handleAddComment} className="mb-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary border-opacity-50 rounded-start-pill py-2 px-4"
                placeholder="Düşüncelerinizi veya sorularınızı yazın..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary rounded-end-pill px-4 fw-semibold">
                Yorum Yap
              </button>
            </div>
          </form>

          <div className="d-flex flex-column gap-3">
            {comments.map((c) => (
              <div key={c.id} className="p-3 rounded-3 border border-secondary border-opacity-25 bg-dark bg-opacity-50">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-white small">{c.author}</strong>
                  <span className="text-white-50" style={{ fontSize: "11px" }}>{c.time}</span>
                </div>
                <p className="text-white-50 small mb-0">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DM Modal */}
      {showDmModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden" style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div className="modal-header border-bottom border-secondary border-opacity-25 px-4 py-3">
                <h6 className="fw-bold mb-0 text-white">
                  <i className="bi bi-chat-dots-fill text-info me-2" />
                  Zeynep Kaya kullanıcısına mesaj gönder
                </h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDmModal(false)} />
              </div>

              <form onSubmit={handleSendDm}>
                <div className="modal-body p-4">
                  <div className="p-2 bg-dark rounded-3 border border-secondary border-opacity-25 mb-3 small text-white-50">
                    📰 <strong>Makale:</strong> {blog.title}
                  </div>
                  <label className="form-label text-white-50 small fw-semibold">Mesajınız</label>
                  <textarea
                    rows={4}
                    className="form-control bg-dark text-white border-secondary border-opacity-50 rounded-3"
                    placeholder="Yazara soru sorun veya geri bildirim iletin..."
                    value={dmText}
                    onChange={(e) => setDmText(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-footer border-top border-secondary border-opacity-25 px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowDmModal(false)}>İptal</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold">
                    <i className="bi bi-send me-1" /> Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

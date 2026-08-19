import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import blogService from "../../../services/blogService";

function BlogPage() {
  const [blogList, setBlogList] = useState([
    { id: 1, title: "React 19'un Getirdikleri: Concurrent Mode ve Beyond", category: "Web", readTime: "6 dk", date: "12 Ağu 2026", icon: "bi-code-slash", color: "#6366f1", monetization: "₺350 Kazandırdı", author: "Samet Başkale", excerpt: "React 19 ile gelen yeni özellikler, Server Components ve performans iyileştirmeleri hakkında kapsamlı rehber." },
    { id: 2, title: "GPT-4o ile Kurumsal Chatbot Nasıl Kurulur?", category: "Yapay Zekâ", readTime: "9 dk", date: "5 Ağu 2026", icon: "bi-cpu", color: "#34d399", monetization: "₺620 Kazandırdı", author: "Mustafa Aydın", excerpt: "Adım adım OpenAI API entegrasyonu ve kurumsal kullanım senaryoları." },
    { id: 3, title: "2026'da Siber Güvenlik Trendleri", category: "Güvenlik", readTime: "7 dk", date: "28 Tem 2026", icon: "bi-shield-check", color: "#ef4444", monetization: "₺480 Kazandırdı", author: "Uslukılıç Security", excerpt: "Zero-trust mimarisi, AI tabanlı tehdit algılama ve yeni saldırı vektörleri." },
    { id: 4, title: "Flutter vs React Native: 2026 Karşılaştırması", category: "Mobil", readTime: "8 dk", date: "20 Tem 2026", icon: "bi-phone", color: "#38bdf8", monetization: "₺290 Kazandırdı", author: "Elif Aksoy", excerpt: "Performans, ekosistem ve iş gücü açısından güncel bir değerlendirme." },
    { id: 5, title: "Kubernetes ile Sıfırdan Production: Adım Adım Rehber", category: "DevOps", readTime: "12 dk", date: "10 Tem 2026", icon: "bi-cloud-arrow-up", color: "#a855f7", monetization: "₺810 Kazandırdı", author: "Caner Demir", excerpt: "Deployment, scaling ve monitoring için eksiksiz bir Kubernetes kurulum rehberi." },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBlogDetail, setSelectedBlogDetail] = useState(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web");
  const [excerpt, setExcerpt] = useState("");
  const [readTime, setReadTime] = useState("5 dk");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) {
      toast.error("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    setSubmitting(true);
    const newBlog = await blogService.createBlog({
      title,
      category,
      excerpt,
      readTime: `${readTime} okuma`,
      author: "Samet Başkale",
    });

    setBlogList([newBlog, ...blogList]);
    setSubmitting(false);
    setShowCreateModal(false);

    setTitle("");
    setExcerpt("");
    toast.success("📝 Makaleniz başarıyla yayınlandı! Kazanç havuzuna eklendi.");
  };

  return (
    <>
      {/* Hero */}
      <section className="site-hero" style={{ minHeight: "55vh" }}>
        <div className="site-hero__shape site-hero__shape--1" />
        <div className="site-hero__shape site-hero__shape--2" />
        <div className="container py-5" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <div className="site-hero__badge mx-auto mb-3">
            <span className="site-hero__badge-dot" />
            TechNova Yazar Topluluğu
          </div>
          <h1 className="site-hero__title animate-fade-up">
            Yazılımla İlgili Yaz, <span className="highlight">Okundukça Kazan</span>
          </h1>
          <p className="site-hero__desc mx-auto animate-fade-up animate-delay-1">
            Geliştiricilerin teknik deneyimlerini paylaştığı ve içerik üreterek bakiye kazandığı topluluk alanı.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4 animate-fade-up animate-delay-2">
            <button
              type="button"
              className="btn btn-primary fw-bold px-4 py-3"
              style={{ borderRadius: 12 }}
              onClick={() => setShowCreateModal(true)}
            >
              <i className="bi bi-pencil-square me-2" /> İlk Makaleni Yaz & Yayınla
            </button>
            <Link to="/kazanc-programi" className="btn btn-outline-light fw-bold px-4 py-3" style={{ borderRadius: 12 }}>
              <i className="bi bi-currency-dollar me-2" /> Yazar Kazanç Programı
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="page-section section-light">
        <div className="container">
          <div className="page-heading">
            <span className="page-heading__eyebrow">Topluluk Makaleleri</span>
            <h2 className="page-heading__title">Okundukça Kazandıran Popüler Yazılar</h2>
          </div>

          <div className="row g-4">
            {blogList.map((post, i) => (
              <div key={post.id} className="col-md-6 col-xl-4 animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="blog-card position-relative">
                  {/* Thumb */}
                  <div
                    style={{
                      height: 190,
                      background: `linear-gradient(135deg, ${post.color}22, ${post.color}08)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottom: `1px solid ${post.color}20`,
                      position: "relative",
                    }}
                  >
                    <i className={`bi ${post.icon}`} style={{ fontSize: 60, color: post.color, opacity: 0.6 }} />

                    {/* Earnings Badge */}
                    <span
                      className="position-absolute top-0 end-0 m-3 badge rounded-pill"
                      style={{ background: "rgba(52,211,153,0.2)", color: "#34d399", border: "1px solid rgba(52,211,153,0.4)", fontSize: "0.72rem" }}
                    >
                      <i className="bi bi-wallet2 me-1" />
                      {post.monetization}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span
                        className="badge rounded-pill"
                        style={{ background: `${post.color}18`, color: post.color, fontSize: "0.75rem" }}
                      >
                        {post.category}
                      </span>
                      <span className="text-secondary" style={{ fontSize: "0.8rem" }}>
                        <i className="bi bi-clock me-1" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="h6 fw-bold mb-2" style={{ lineHeight: 1.4 }}>{post.title}</h3>
                    <p className="text-secondary mb-3" style={{ fontSize: "0.87rem" }}>{post.excerpt}</p>

                    <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-10">
                      <span className="text-secondary small">
                        <i className="bi bi-person me-1" />{post.author}
                      </span>

                      <button
                        className="btn btn-link p-0 text-decoration-none d-inline-flex align-items-center gap-1 fw-semibold small"
                        style={{ color: post.color }}
                        onClick={() => setSelectedBlogDetail(post)}
                      >
                        Devamını Oku <i className="bi bi-arrow-right" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREATE BLOG MODAL */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content surface-card p-4" style={{ borderRadius: 24 }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil-fill text-primary me-2" />
                  Yeni Blog Makalesi Yaz & Yayınla
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)} />
              </div>
              <div className="modal-body py-3">
                <form onSubmit={handleCreateBlog}>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold">Makale Başlığı *</label>
                      <input
                        type="text"
                        className="form-control contact-input"
                        placeholder="Örn: React 19 ve Server Components Rehberi"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold">Kategori *</label>
                      <select className="form-select contact-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Web">Web Teknolojileri</option>
                        <option value="Yapay Zekâ">Yapay Zekâ</option>
                        <option value="Mobil">Mobil</option>
                        <option value="Güvenlik">Güvenlik</option>
                        <option value="DevOps">DevOps</option>
                      </select>
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-semibold">Özet & İçerik *</label>
                      <textarea
                        className="form-control contact-input"
                        rows="4"
                        placeholder="Makalenizin ana detaylarını girin..."
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>İptal</button>
                    <button type="submit" className="btn btn-primary fw-bold px-4" disabled={submitting}>
                      {submitting ? "Yayınlanıyor..." : "Makaleyi Yayınla"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BLOG DETAIL MODAL */}
      {selectedBlogDetail && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content surface-card p-4" style={{ borderRadius: 24 }}>
              <div className="modal-header border-0 pb-0">
                <div>
                  <span className="badge bg-primary mb-1">{selectedBlogDetail.category}</span>
                  <h4 className="modal-title fw-bold">{selectedBlogDetail.title}</h4>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedBlogDetail(null)} />
              </div>
              <div className="modal-body py-3">
                <div className="d-flex align-items-center justify-content-between p-3 bg-dark rounded-3 mb-3">
                  <span className="text-secondary small"><i className="bi bi-person me-1" /> Yazar: <strong>{selectedBlogDetail.author}</strong></span>
                  <span className="badge bg-success">{selectedBlogDetail.monetization}</span>
                </div>
                <p className="text-light fs-5" style={{ lineHeight: 1.6 }}>{selectedBlogDetail.excerpt}</p>
                <div className="alert alert-info small mt-3">
                  💡 Bu makale her okunduğunda yazar bakiyesine katkı sağlar. 1.000 okunma = 250 ₺.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BlogPage;

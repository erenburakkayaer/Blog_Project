import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import projectService from "../../../services/projectService";
import uploadService from "../../../services/uploadService";
import useAuth from "../../../hooks/useAuth";

const categories = ["Tümü", "Web", "Mobil", "Yapay Zekâ", "Siber Güvenlik"];

function ProjectsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [active, setActive] = useState("Tümü");
  const [visibilityFilter, setVisibilityFilter] = useState("Hepsi");

  // State for live projects list
  const [projectList, setProjectList] = useState([
    { id: 1, title: "FinTech Dashboard", category: "Web", tag: "React · Node.js", color: "#6366f1", icon: "bi-bar-chart-line", desc: "Gerçek zamanlı finansal analitik platformu.", visibility: "Public", boosted: true, author: "Ahmet Yılmaz", fileName: "fintech-v1.zip" },
    { id: 2, title: "MedApp Mobil", category: "Mobil", tag: "React Native", color: "#38bdf8", icon: "bi-heart-pulse", desc: "Hasta takip ve randevu yönetimi uygulaması.", visibility: "Public", boosted: false, author: "Zeynep Kaya", fileName: "medapp-release.apk" },
    { id: 3, title: "AI Chatbot Platformu", category: "Yapay Zekâ", tag: "Python · GPT-4", color: "#34d399", icon: "bi-chat-square-dots", desc: "Kurumsal müşteri hizmetleri chatbot altyapısı.", visibility: "Private (Pro)", boosted: true, author: "Samet Başkale", fileName: "ai-core.py" },
    { id: 4, title: "E-Ticaret Sistemi", category: "Web", tag: "Next.js · Stripe", color: "#f59e0b", icon: "bi-cart3", desc: "Çok satıcılı marketplace platformu.", visibility: "Public", boosted: false, author: "Caner Demir", fileName: "shop-bundle.zip" },
    { id: 5, title: "SecureAudit Core", category: "Siber Güvenlik", tag: "Penetrasyon Testi", color: "#ef4444", icon: "bi-shield-lock", desc: "Büyük ölçekli altyapı güvenlik denetim aracı.", visibility: "Private (Pro)", boosted: false, author: "Uslukılıç Security", fileName: "sec-audit.pdf" },
    { id: 6, title: "Lojistik Tracker", category: "Mobil", tag: "Flutter · Firebase", color: "#a855f7", icon: "bi-truck", desc: "Gerçek zamanlı kargo takip uygulaması.", visibility: "Public", boosted: false, author: "Elif Aksoy", fileName: "logistic-app.apk" },
  ]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedBoostProject, setSelectedBoostProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [detailProject, setDetailProject] = useState(null);

  // Form states for New Project
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Web");
  const [newDesc, setNewDesc] = useState("");
  const [newVisibility, setNewVisibility] = useState("Public");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Filter logic
  const filtered = projectList.filter((p) => {
    const matchesCat = active === "Tümü" || p.category === active;
    const matchesVis =
      visibilityFilter === "Hepsi" ||
      (visibilityFilter === "Public" && p.visibility === "Public") ||
      (visibilityFilter === "Private" && p.visibility.includes("Private"));
    return matchesCat && matchesVis;
  });

  // Handle New Project Creation
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      toast.error("Lütfen proje başlığı ve açıklamasını doldurun.");
      return;
    }

    setUploading(true);
    let uploadedFileName = "";
    if (selectedFile) {
      try {
        const uploadRes = await uploadService.uploadFile(selectedFile);
        uploadedFileName = uploadRes.fileName;
        toast.success(`Dosya yüklendi: ${uploadedFileName}`);
      } catch (err) {
        toast.error("Dosya yükleme hatası!");
      }
    }

    const created = await projectService.createProject({
      title: newTitle,
      category: newCategory,
      tag: `${newCategory} · TechNova`,
      desc: newDesc,
      visibility: newVisibility,
      fileName: uploadedFileName || "proje-kodlari.zip",
      author: "Samet Başkale",
    });

    setProjectList([created, ...projectList]);
    setUploading(false);
    setShowAddModal(false);

    // Reset Form
    setNewTitle("");
    setNewDesc("");
    setSelectedFile(null);
    toast.success("🚀 Yeni projeniz başarıyla yayınlandı!");
  };

  // Handle Delete Project
  const handleDeleteProject = async (id) => {
    await projectService.deleteProject(id);
    setProjectList(projectList.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
    toast.success("Proje listeden silindi.");
  };

  // Handle Boost Action
  const handleApplyBoost = async (days) => {
    if (!selectedBoostProject) return;
    await projectService.boostProject(selectedBoostProject.id, days);
    setProjectList(
      projectList.map((p) =>
        p.id === selectedBoostProject.id ? { ...p, boosted: true } : p
      )
    );
    setShowBoostModal(false);
    toast.success(`🚀 Projeniz ${days} gün boyunca öne çıkarıldı!`);
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
            TechNova Proje Vitrini
          </div>
          <h1 className="site-hero__title animate-fade-up">
            Geliştiricilerin <span className="highlight">İnovatif Projeleri</span>
          </h1>
          <p className="site-hero__desc mx-auto animate-fade-up animate-delay-1">
            Geliştiricilerin ister herkese açık ister özel (private pro) olarak barındırdığı projeleri keşfedin.
            Kendi projelerinizi yükleyip binlerce kişiye sergileyin.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4 animate-fade-up animate-delay-2">
            <button
              type="button"
              className="btn btn-primary fw-bold px-4 py-3 shadow-lg"
              style={{ borderRadius: 12 }}
              onClick={() => {
                if (!isAuthenticated) {
                  toast("🚀 Proje yayınlamak için lütfen önce giriş yapınız veya kayıt olunuz.", { icon: "🔒" });
                  navigate("/giris");
                  return;
                }
                setShowAddModal(true);
              }}
            >
              <i className="bi bi-cloud-arrow-up-fill me-2" /> Kendi Projeni Ekle / Yükle
            </button>
            <button
              type="button"
              className="btn btn-outline-light fw-bold px-4 py-3"
              style={{ borderRadius: 12 }}
              onClick={() => {
                if (!isAuthenticated) {
                  toast("⚡ Projenizi öne çıkarmak için lütfen önce giriş yapınız.", { icon: "🔒" });
                  navigate("/giris");
                  return;
                }
                navigate("/kazanc-programi");
              }}
            >
              <i className="bi bi-rocket-takeoff me-2" /> Projeni Öne Çıkar (Boost)
            </button>
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="page-section section-light">
        <div className="container">
          {/* Controls Bar */}
          <div className="d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between mb-5">
            {/* Category tabs */}
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn${active === cat ? " active" : ""}`}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Visibility filter dropdown */}
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary small fw-semibold">Erişim:</span>
              <select
                className="form-select contact-input"
                style={{ width: "auto", fontSize: "0.85rem", padding: "0.4rem 1rem" }}
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
              >
                <option value="Hepsi">Tüm Projeler</option>
                <option value="Public">🌐 Herkese Açık (Public)</option>
                <option value="Private">🔒 Özel (Private Pro)</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="row g-4">
            {filtered.map((project, i) => (
              <div key={project.id} className="col-md-6 col-xl-4 animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <div
                  className="project-card d-flex flex-column position-relative"
                  style={{
                    height: 330,
                    background: `linear-gradient(135deg, ${project.color}22, ${project.color}08)`,
                    border: `1px solid ${project.color}30`,
                    borderRadius: 20,
                  }}
                >
                  {/* Badges on top */}
                  <div className="position-absolute top-0 start-0 end-0 p-3 d-flex justify-content-between align-items-center" style={{ zIndex: 3 }}>
                    {project.boosted ? (
                      <span className="badge" style={{ background: "linear-gradient(135deg, #f59e0b, #ec4899)", color: "#fff", fontSize: "0.7rem", padding: "0.35rem 0.6rem" }}>
                        <i className="bi bi-rocket-takeoff-fill me-1" /> ÖNE ÇIKAN
                      </span>
                    ) : (
                      <span />
                    )}

                    <span
                      className="badge rounded-pill"
                      style={{
                        background: project.visibility === "Public" ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)",
                        color: project.visibility === "Public" ? "#34d399" : "#ef4444",
                        fontSize: "0.72rem",
                        border: `1px solid ${project.visibility === "Public" ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)"}`,
                        padding: "0.35rem 0.6rem",
                      }}
                    >
                      {project.visibility === "Public" ? <i className="bi bi-globe me-1" /> : <i className="bi bi-lock-fill me-1" />}
                      {project.visibility}
                    </span>
                  </div>

                  {/* Visual Icon */}
                  <div className="flex-grow-1 d-flex align-items-center justify-content-center mt-4">
                    <i className={`bi ${project.icon}`} style={{ fontSize: 64, color: project.color, opacity: 0.6 }} />
                  </div>

                  {/* Overlay info */}
                  <div className="project-card__overlay p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge rounded-pill" style={{ background: `${project.color}33`, color: project.color, fontSize: "0.73rem" }}>
                        {project.tag}
                      </span>
                      <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                        <i className="bi bi-person me-1" />{project.author}
                      </span>
                    </div>

                    <h3 className="h6 fw-bold text-white mb-1">{project.title}</h3>
                    <p className="mb-2" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>{project.desc}</p>

                    {project.fileName && (
                      <div className="small mb-2 text-info" style={{ fontSize: "0.75rem" }}>
                        <i className="bi bi-paperclip me-1" /> Dosya: <strong>{project.fileName}</strong>
                      </div>
                    )}

                    {/* Interactive Action Buttons */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary w-50 fw-semibold"
                        style={{ borderRadius: 8, fontSize: "0.78rem" }}
                        onClick={() => setDetailProject(project)}
                      >
                        <i className="bi bi-eye me-1" /> İncele
                      </button>

                      {!project.boosted && (
                        <button
                          className="btn btn-sm btn-warning w-50 fw-semibold text-dark"
                          style={{ borderRadius: 8, fontSize: "0.78rem" }}
                          onClick={() => { setSelectedBoostProject(project); setShowBoostModal(true); }}
                        >
                          <i className="bi bi-rocket-takeoff me-1" /> Boost Et
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-outline-danger px-2"
                        style={{ borderRadius: 8 }}
                        title="Projeyi Sil"
                        onClick={() => setDeleteConfirmId(project.id)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 MODAL 1: NEW PROJECT ADD MODAL */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content surface-card p-4" style={{ borderRadius: 24 }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-white">
                  <i className="bi bi-plus-circle-fill text-primary me-2" />
                  Yeni Proje Yayınla & Dosya Yükle
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)} />
              </div>
              <div className="modal-body py-3">
                <form onSubmit={handleCreateProject}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Proje Başlığı *</label>
                      <input
                        type="text"
                        className="form-control contact-input"
                        placeholder="Örn: FinTech Analiz Botu"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Kategori *</label>
                      <select
                        className="form-select contact-input"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      >
                        <option value="Web">Web Teknolojileri</option>
                        <option value="Mobil">Mobil Uygulama</option>
                        <option value="Yapay Zekâ">Yapay Zekâ & ML</option>
                        <option value="Siber Güvenlik">Siber Güvenlik</option>
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-semibold small">Açıklama *</label>
                      <textarea
                        className="form-control contact-input"
                        rows="3"
                        placeholder="Projenin amacı, kullanılan teknolojiler..."
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Gizlilik Seviyesi *</label>
                      <select
                        className="form-select contact-input"
                        value={newVisibility}
                        onChange={(e) => setNewVisibility(e.target.value)}
                      >
                        <option value="Public">🌐 Herkese Açık (Public)</option>
                        <option value="Private (Pro)">🔒 Özel (Private Pro Barındırma)</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Proje Dosyası / Kaynak Kod (.zip, .apk, .pdf)</label>
                      <input
                        type="file"
                        className="form-control contact-input"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>İptal</button>
                    <button type="submit" className="btn btn-primary fw-bold px-4" disabled={uploading}>
                      {uploading ? "Yükleniyor..." : "Projeyi Yayınla"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 MODAL 2: BOOST MODAL */}
      {showBoostModal && selectedBoostProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content surface-card p-4" style={{ borderRadius: 24 }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-warning">
                  <i className="bi bi-rocket-takeoff-fill me-2" />
                  Projeni Öne Çıkar (Boost)
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowBoostModal(false)} />
              </div>
              <div className="modal-body py-3">
                <p className="text-secondary small">
                  <strong>{selectedBoostProject.title}</strong> projeniz ana sayfa vitrininde 10.000+ yazılımcının en tepesinde sergilensin.
                </p>

                <div className="row g-3 my-2">
                  <div className="col-6">
                    <div className="border border-primary rounded-3 p-3 text-center cursor-pointer" onClick={() => handleApplyBoost(7)}>
                      <h6 className="fw-bold mb-1">7 Günlük Boost</h6>
                      <div className="h4 text-primary fw-bold mb-0">₺199</div>
                      <span className="badge bg-primary mt-1">Popüler</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border border-warning rounded-3 p-3 text-center cursor-pointer" onClick={() => handleApplyBoost(30)}>
                      <h6 className="fw-bold mb-1">30 Günlük Boost</h6>
                      <div className="h4 text-warning fw-bold mb-0">₺499</div>
                      <span className="badge bg-warning text-dark mt-1">%30 Tasarruf</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 MODAL 3: DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content surface-card p-4 text-center" style={{ borderRadius: 20 }}>
              <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-2" />
              <h5 className="fw-bold">Projeyi Sil?</h5>
              <p className="text-secondary small mb-3">Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
              <div className="d-flex gap-2">
                <button className="btn btn-secondary w-50" onClick={() => setDeleteConfirmId(null)}>İptal</button>
                <button className="btn btn-danger w-50 fw-bold" onClick={() => handleDeleteProject(deleteConfirmId)}>Sil</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 MODAL 4: PROJECT DETAIL MODAL */}
      {detailProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content surface-card p-4" style={{ borderRadius: 24 }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{detailProject.title}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setDetailProject(null)} />
              </div>
              <div className="modal-body py-3">
                <span className="badge bg-primary mb-2">{detailProject.category}</span>
                <p className="text-secondary mb-3">{detailProject.desc}</p>
                <div className="p-3 bg-dark rounded-3 mb-3">
                  <div className="small text-secondary mb-1">Geliştirici: <strong>{detailProject.author}</strong></div>
                  <div className="small text-secondary mb-1">Erişim: <strong>{detailProject.visibility}</strong></div>
                  <div className="small text-info">Dosya: <strong>{detailProject.fileName || "Yok"}</strong></div>
                </div>
                <button className="btn btn-success w-100 fw-bold py-2" onClick={() => { toast.success("Proje dosyaları indiriliyor..."); setDetailProject(null); }}>
                  <i className="bi bi-download me-2" /> Kaynak Kodları İndir (.zip)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectsPage;

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { projectService } from "../../../services/projectService";
import { communityService } from "../../../services/communityService";
import useAuth from "../../../hooks/useAuth";

const SAMPLE_FILES = [
  {
    name: "README.md",
    language: "markdown",
    content: `# Proje Dokümantasyonu\n\nBu proje **TechNova** geliştirici platformu üzerinde açık kaynak olarak yayınlanmıştır.\n\n## 🚀 Kurulum\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## ✨ Özellikler\n- React 19 & Vite mimarisi\n- ASP.NET Core Web API entegrasyonu\n- JWT Tabanlı Kimlik Doğrulama\n- SQL Server Code-First Mimarisi`,
  },
  {
    name: "src/App.jsx",
    language: "javascript",
    content: `import React, { useState, useEffect } from 'react';\nimport { BrowserRouter as Router } from 'react-router-dom';\n\nexport default function App() {\n  const [isReady, setIsReady] = useState(false);\n\n  useEffect(() => {\n    console.log("TechNova App Initialized");\n    setIsReady(true);\n  }, []);\n\n  return (\n    <div className="app-container">\n      <h1>TechNova Enterprise Platform</h1>\n    </div>\n  );\n}`,
  },
  {
    name: "backend/Program.cs",
    language: "csharp",
    content: `var builder = WebApplication.CreateBuilder(args);\n\nbuilder.Services.AddControllers();\nbuilder.Services.AddEndpointsApiExplorer();\nbuilder.Services.AddSwaggerGen();\n\nvar app = builder.Build();\n\napp.UseHttpsRedirection();\napp.UseAuthorization();\napp.MapControllers();\n\napp.Run();`,
  },
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(SAMPLE_FILES[0]);
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(42);

  // DM Modal
  const [showDmModal, setShowDmModal] = useState(false);
  const [dmText, setDmText] = useState("");

  // Comments
  const [comments, setComments] = useState([
    { id: 1, author: "Eren Demir", role: "Geliştirici", text: "Tasarım ve mimari çok temiz kurulmuş, elinize sağlık!", time: "2 saat önce" },
    { id: 2, author: "Zeynep Kaya", role: "Teknik Yazar", text: "Dokümantasyon çok açıklayıcı olmuş, projeyi fork'ladım.", time: "1 gün önce" },
  ]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const found = await projectService.getById(id);
        setProject(found);
        setIsStarred(communityService.isStarred(id));
      } catch {
        toast.error("Proje yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleStarToggle = () => {
    if (!user) {
      toast("Projeyi yıldızlamak için lütfen giriş yapınız.", { icon: "🔒" });
      navigate("/giris");
      return;
    }
    const next = communityService.toggleStar(id);
    setIsStarred(next);
    setStarCount((c) => (next ? c + 1 : c - 1));
    toast.success(next ? "⭐ Proje favorilerinize eklendi!" : "Yıldız kaldırıldı.");
  };

  const handleSendDm = (e) => {
    e.preventDefault();
    if (!dmText.trim()) return;
    if (!user) {
      toast("Mesaj göndermek için lütfen giriş yapınız.", { icon: "🔒" });
      navigate("/giris");
      return;
    }
    communityService.sendMessage("samet_admin", dmText, { title: project.title });
    toast.success(`✉️ Mesajınız geliştiriciye iletildi!`);
    setDmText("");
    setShowDmModal(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
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
        role: user.role || "Üye",
        text: newComment.trim(),
        time: "Şimdi",
      },
    ]);
    setNewComment("");
    toast.success("💬 Yorumunuz yayınlandı!");
  };

  const handleDownloadCode = () => {
    toast.success("📦 Proje kaynak kodları ZIP arşivi olarak hazırlanıyor...");
  };

  if (loading) {
    return (
      <div className="py-5 text-center bg-dark text-white" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary my-5" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-5 text-center bg-dark text-white" style={{ minHeight: "80vh" }}>
        <h2 className="fw-bold">Proje bulunamadı.</h2>
        <Link to="/projeler" className="btn btn-primary rounded-pill mt-3 px-4">
          Tüm Projelere Dön
        </Link>
      </div>
    );
  }

  const mediaList = [
    project.coverImageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
  ];

  return (
    <div style={{ background: "#0a0f1d", color: "#f8fafc", minHeight: "100vh" }} className="py-5">
      <div className="container py-3">
        {/* Breadcrumb & Navigation */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <Link to="/projeler" className="text-white-50 text-decoration-none small">
            <i className="bi bi-arrow-left me-2" /> Tüm Projelere Dön
          </Link>
          <div className="d-flex gap-2">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${isStarred ? "btn-warning text-dark" : "btn-outline-light"}`}
              onClick={handleStarToggle}
            >
              <i className={`bi ${isStarred ? "bi-star-fill" : "bi-star"} me-1`} />
              {isStarred ? "Yıldızlandı" : "Yıldızla"} ({starCount})
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold"
              onClick={handleDownloadCode}
            >
              <i className="bi bi-download me-1" /> Kodu İndir (ZIP)
            </button>
          </div>
        </div>

        {/* Project Hero Header */}
        <div className="row g-4 mb-5">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 rounded-pill px-3 py-1">
                {project.categoryName || project.category || "Web Platformu"}
              </span>
              <span className="badge bg-success bg-opacity-20 text-success rounded-pill px-2 py-1 small">
                ● Açık Kaynak
              </span>
            </div>

            <h1 className="display-6 fw-bold text-white mb-3">{project.title}</h1>
            <p className="lead text-white-50 fs-6 mb-4">
              {project.description || project.summary || project.shortDescription}
            </p>

            {/* INSTAGRAM CAROUSEL / MEDIA VIEWER */}
            <div className="rounded-4 overflow-hidden shadow-2xl border border-secondary border-opacity-25 mb-4" style={{ background: "#0f172a" }}>
              <img
                src={mediaList[activeMediaIndex]}
                alt={project.title}
                className="w-100 object-fit-cover transition-all"
                style={{ height: "420px" }}
              />

              {/* Thumbnails */}
              <div className="d-flex gap-2 p-3 bg-dark bg-opacity-75 border-top border-secondary border-opacity-25">
                {mediaList.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="thumb"
                    className={`rounded-3 cursor-pointer object-fit-cover ${activeMediaIndex === idx ? "border border-2 border-primary" : "opacity-50"}`}
                    style={{ width: "80px", height: "55px", cursor: "pointer" }}
                    onClick={() => setActiveMediaIndex(idx)}
                  />
                ))}
              </div>
            </div>

            {/* GITHUB CODE INSPECTOR & FILE TREE */}
            <div className="card rounded-4 border border-secondary border-opacity-25 overflow-hidden shadow-xl mb-4" style={{ background: "rgba(15, 23, 42, 0.95)" }}>
              <div className="card-header bg-dark bg-opacity-75 px-4 py-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-github fs-5 text-white" />
                  <span className="fw-bold text-white small">GitHub Deposu & Kaynak Kodları</span>
                </div>
                <span className="badge bg-secondary bg-opacity-50 font-monospace small">branch: main</span>
              </div>

              <div className="row g-0">
                {/* File Tree List */}
                <div className="col-md-4 border-end border-secondary border-opacity-25 p-3">
                  <div className="small fw-semibold text-white-50 mb-2 px-2">DOSYA AĞACI</div>
                  <div className="list-group list-group-flush">
                    {SAMPLE_FILES.map((file, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`list-group-item list-group-item-action bg-transparent text-start border-0 rounded-3 py-2 px-3 small ${selectedFile.name === file.name ? "active bg-primary text-white" : "text-white-50"}`}
                        onClick={() => setSelectedFile(file)}
                      >
                        <i className={`bi ${file.name.endsWith(".md") ? "bi-markdown text-info" : file.name.endsWith(".jsx") ? "bi-filetype-jsx text-warning" : "bi-file-code text-success"} me-2`} />
                        {file.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Content */}
                <div className="col-md-8 p-3 bg-black bg-opacity-50">
                  <div className="d-flex justify-content-between align-items-center mb-2 px-2 pb-2 border-bottom border-secondary border-opacity-25">
                    <span className="small font-monospace text-white-50">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="btn btn-outline-light btn-sm rounded-pill px-3"
                      style={{ fontSize: "11px" }}
                      onClick={() => {
                        navigator.clipboard.writeText(selectedFile.content);
                        toast.success("📋 Kod panoya kopyalandı!");
                      }}
                    >
                      <i className="bi bi-clipboard me-1" /> Kopyala
                    </button>
                  </div>
                  <pre className="p-3 text-light font-monospace small mb-0 overflow-auto" style={{ maxHeight: "250px" }}>
                    <code>{selectedFile.content}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* COMMENTS & COMMUNITY */}
            <div className="card rounded-4 border border-secondary border-opacity-25 p-4 shadow-xl" style={{ background: "rgba(15, 23, 42, 0.95)" }}>
              <h5 className="fw-bold text-white mb-3">
                <i className="bi bi-chat-dots me-2 text-primary" />
                Geliştirici Yorumları ({comments.length})
              </h5>

              <form onSubmit={handleAddComment} className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary border-opacity-50 rounded-start-pill py-2 px-4"
                    placeholder="Bu proje hakkında bir soru sor veya fikir belirt..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary rounded-end-pill px-4 fw-semibold">
                    Gönder
                  </button>
                </div>
              </form>

              <div className="d-flex flex-column gap-3">
                {comments.map((comm) => (
                  <div key={comm.id} className="p-3 rounded-3 border border-secondary border-opacity-25 bg-dark bg-opacity-50">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="text-white small">{comm.author}</strong>
                      <span className="text-white-50" style={{ fontSize: "11px" }}>{comm.time}</span>
                    </div>
                    <p className="text-white-50 small mb-0">{comm.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR: GELİŞTİRİCİ KARTI (LINKEDIN STYLE) */}
          <div className="col-lg-4">
            <div className="card rounded-4 border border-secondary border-opacity-25 p-4 shadow-xl mb-4" style={{ background: "rgba(15, 23, 42, 0.95)" }}>
              <div className="small text-white-50 fw-semibold mb-3">PROJE SAHİBİ & GELİŞTİRİCİ</div>

              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
                  alt="Developer"
                  className="rounded-circle border border-2 border-primary object-fit-cover"
                  style={{ width: "65px", height: "65px" }}
                />
                <div>
                  <h6 className="fw-bold text-white mb-0">Samet Başkale</h6>
                  <small className="text-primary d-block">Senior Full-Stack Developer</small>
                  <span className="badge bg-danger rounded-pill px-2 py-0 small mt-1" style={{ fontSize: "10px" }}>
                    🇹🇷 e-Devlet Onaylı
                  </span>
                </div>
              </div>

              <p className="text-white-50 small mb-3">
                Uslukılıç Yazılım kurucusu. React 19 ve .NET mimarileri ile açık kaynak çözümler geliştiriyor.
              </p>

              <div className="d-grid gap-2">
                <Link to="/profil/samet_admin" className="btn btn-outline-light rounded-pill py-2 fw-semibold small">
                  <i className="bi bi-person-badge me-2" />
                  Profili İncele
                </Link>

                <button
                  type="button"
                  className="btn btn-info text-dark rounded-pill py-2 fw-bold small"
                  onClick={() => setShowDmModal(true)}
                >
                  <i className="bi bi-chat-text-fill me-2" />
                  Geliştiriciye Mesaj At (DM)
                </button>
              </div>
            </div>

            {/* Quick Tech Info */}
            <div className="card rounded-4 border border-secondary border-opacity-25 p-4 shadow-xl" style={{ background: "rgba(15, 23, 42, 0.95)" }}>
              <h6 className="fw-bold text-white mb-3">Proje Detayları</h6>

              <ul className="list-unstyled small text-white-50 mb-0 d-flex flex-column gap-2">
                <li className="d-flex justify-content-between">
                  <span>Kategori:</span>
                  <strong className="text-white">{project.categoryName || project.category || "Web"}</strong>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Kullanılan Diller:</span>
                  <strong className="text-white">{project.usedTechnologies || "React 19, .NET 10"}</strong>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Yayın Tarihi:</span>
                  <strong className="text-white">Ağustos 2026</strong>
                </li>
                <li className="d-flex justify-content-between">
                  <span>Lisans:</span>
                  <strong className="text-success">MIT (Açık Kaynak)</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* DIRECT MESSAGE MODAL */}
      {showDmModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden" style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div className="modal-header border-bottom border-secondary border-opacity-25 px-4 py-3">
                <h6 className="fw-bold mb-0 text-white">
                  <i className="bi bi-chat-dots-fill text-info me-2" />
                  Samet Başkale kullanıcısına mesaj gönder
                </h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDmModal(false)} />
              </div>

              <form onSubmit={handleSendDm}>
                <div className="modal-body p-4">
                  <div className="p-2 bg-dark rounded-3 border border-secondary border-opacity-25 mb-3 small text-white-50">
                    📌 <strong>Proje:</strong> {project.title}
                  </div>
                  <label className="form-label text-white-50 small fw-semibold">Mesajınız</label>
                  <textarea
                    rows={4}
                    className="form-control bg-dark text-white border-secondary border-opacity-50 rounded-3"
                    placeholder="Proje hakkında geliştirmeler, iş birliği veya soru..."
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

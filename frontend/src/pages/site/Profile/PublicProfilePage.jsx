import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { communityService } from "../../../services/communityService";
import { projectService } from "../../../services/projectService";
import { blogService } from "../../../services/blogService";
import useAuth from "../../../hooks/useAuth";

export default function PublicProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // DM Modal
  const [showDmModal, setShowDmModal] = useState(false);
  const [dmText, setDmText] = useState("");

  useEffect(() => {
    const userProfile = communityService.getUserProfile(username || "samet_admin");
    setProfile(userProfile);
    setIsFollowing(communityService.isFollowing(userProfile.username));
    setFollowersCount(userProfile.followersCount);

    const loadContent = async () => {
      try {
        const [allProjects, allBlogs] = await Promise.all([
          projectService.getAll(),
          blogService.getAll(),
        ]);
        setProjects(Array.isArray(allProjects) ? allProjects : []);
        setBlogs(Array.isArray(allBlogs) ? allBlogs : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [username]);

  const handleFollowToggle = () => {
    if (!currentUser) {
      toast("Takip etmek için lütfen giriş yapınız.", { icon: "🔒" });
      navigate("/giris");
      return;
    }
    const nextState = communityService.toggleFollow(profile.username);
    setIsFollowing(nextState);
    setFollowersCount((prev) => (nextState ? prev + 1 : prev - 1));
    toast.success(nextState ? `🎉 ${profile.fullName} takip edildi!` : `${profile.fullName} takipten çıkarıldı.`);
  };

  const handleSendDm = (e) => {
    e.preventDefault();
    if (!dmText.trim()) return;
    if (!currentUser) {
      toast("Mesaj göndermek için lütfen giriş yapınız.", { icon: "🔒" });
      navigate("/giris");
      return;
    }
    communityService.sendMessage(profile.username, dmText);
    toast.success(`✉️ Mesajınız ${profile.fullName} kullanıcısına iletildi!`);
    setDmText("");
    setShowDmModal(false);
  };

  if (!profile) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="py-5" style={{ background: "#0a0f1d", minHeight: "100vh", color: "#f8fafc" }}>
      <div className="container py-3">
        {/* 1. LINKEDIN & INSTAGRAM HYBRID HEADER */}
        <div className="rounded-4 overflow-hidden shadow-2xl mb-4 border border-secondary border-opacity-25" style={{ background: "rgba(15, 23, 42, 0.9)" }}>
          {/* Banner */}
          <div style={{ height: "200px", background: profile.banner }} className="position-relative">
            <div className="position-absolute end-0 top-0 bottom-0 opacity-30" style={{ width: "50%", background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
          </div>

          {/* Profile Header Content */}
          <div className="px-4 px-md-5 pb-4 position-relative">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end justify-content-between gap-3" style={{ marginTop: "-65px" }}>
              {/* Avatar with Status Ring */}
              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-4 text-center text-md-start">
                <div className="position-relative">
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="rounded-circle border border-4 border-dark shadow-2xl object-fit-cover"
                    style={{ width: "130px", height: "130px" }}
                  />
                  <span className="position-absolute bottom-0 end-0 p-2 bg-success border border-2 border-dark rounded-circle" title="Aktif Geliştirici" />
                </div>

                <div className="mb-2">
                  <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                    <h1 className="h3 fw-bold mb-0 text-white">{profile.fullName}</h1>
                    {profile.isEDevletVerified && (
                      <span className="badge bg-danger rounded-pill px-2 py-1 small" title="e-Devlet ile Kimliği Doğrulanmış">
                        🇹🇷 e-Devlet Onaylı
                      </span>
                    )}
                    <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 rounded-pill px-3 py-1 small">
                      {profile.roleLabel}
                    </span>
                  </div>

                  <p className="text-white-50 small mb-2">
                    @{profile.username} • {profile.company}
                  </p>

                  <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-3 small text-white-50">
                    <span><i className="bi bi-geo-alt me-1 text-warning" />{profile.location}</span>
                    <span><strong className="text-white">{followersCount}</strong> Takipçi</span>
                    <span><strong className="text-white">{profile.followingCount}</strong> Takip</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 mb-2">
                <button
                  type="button"
                  className={`btn px-4 rounded-pill fw-semibold shadow-sm transition-all ${isFollowing ? "btn-outline-light" : "btn-primary"}`}
                  onClick={handleFollowToggle}
                >
                  <i className={`bi ${isFollowing ? "bi-check2 me-1" : "bi-person-plus me-1"}`} />
                  {isFollowing ? "Takip Ediliyor" : "Takip Et"}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-info px-4 rounded-pill fw-semibold shadow-sm"
                  onClick={() => setShowDmModal(true)}
                >
                  <i className="bi bi-chat-dots-fill me-1" />
                  Mesaj Gönder
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
              <p className="text-white-50 mb-3" style={{ maxWidth: "800px" }}>
                {profile.bio}
              </p>

              {/* Social Links & Skills */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex flex-wrap gap-2">
                  {profile.skills?.map((skill, idx) => (
                    <span key={idx} className="badge bg-dark bg-opacity-75 border border-secondary border-opacity-50 text-light px-3 py-2 rounded-pill small">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="d-flex gap-3 fs-5">
                  {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-white-50 hover-text-white"><i className="bi bi-github" /></a>}
                  {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-info hover-text-white"><i className="bi bi-linkedin" /></a>}
                  {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-success hover-text-white"><i className="bi bi-globe" /></a>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. TABS: PROJELER & BLOG YAZILARI & HAKKINDA */}
        <div className="d-flex rounded-3 p-1 mb-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", maxWidth: "450px" }}>
          <button
            type="button"
            className={`btn w-50 fw-semibold rounded-2 py-2 ${activeTab === "projects" ? "btn-primary text-white shadow-sm" : "text-white-50"}`}
            onClick={() => setActiveTab("projects")}
          >
            <i className="bi bi-code-square me-2" />
            Projeler ({projects.length})
          </button>
          <button
            type="button"
            className={`btn w-50 fw-semibold rounded-2 py-2 ${activeTab === "blogs" ? "btn-primary text-white shadow-sm" : "text-white-50"}`}
            onClick={() => setActiveTab("blogs")}
          >
            <i className="bi bi-journal-richtext me-2" />
            Blog Yazıları ({blogs.length})
          </button>
        </div>

        {/* TAB 1: PROJELER */}
        {activeTab === "projects" && (
          <div className="row g-4">
            {projects.map((proj) => (
              <div key={proj.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 rounded-4 overflow-hidden shadow-lg transition-all" style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <img
                    src={proj.coverImageUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"}
                    alt={proj.title}
                    className="card-img-top object-fit-cover"
                    style={{ height: "180px" }}
                  />
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-1 small">
                        {proj.categoryName || proj.category || "Web"}
                      </span>
                      <span className="small text-warning">
                        <i className="bi bi-star-fill me-1" /> 42 Yıldız
                      </span>
                    </div>

                    <h5 className="card-title fw-bold text-white mb-2">{proj.title}</h5>
                    <p className="card-text text-white-50 small flex-grow-1">
                      {proj.shortDescription || proj.summary || proj.description?.slice(0, 100) + "..."}
                    </p>

                    <div className="pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                      <Link to={`/projeler/${proj.id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        Kodu & Projeyi İncele <i className="bi bi-arrow-right ms-1" />
                      </Link>

                      <button
                        type="button"
                        className="btn btn-outline-info btn-sm rounded-circle p-2"
                        title="Proje Hakkında Mesaj At"
                        onClick={() => {
                          setDmText(`Merhaba, '${proj.title}' projeniz hakkında soru sormak istiyorum.`);
                          setShowDmModal(true);
                        }}
                      >
                        <i className="bi bi-chat-text" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: BLOG YAZILARI */}
        {activeTab === "blogs" && (
          <div className="row g-4">
            {blogs.map((b) => (
              <div key={b.id} className="col-md-6">
                <div className="card h-100 border-0 rounded-4 overflow-hidden shadow-lg p-4" style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-25 rounded-pill px-3 py-1 small">
                      {b.categoryName || b.category || "Teknoloji"}
                    </span>
                    <span className="badge bg-success bg-opacity-20 text-success rounded-pill px-2 py-1 small">
                      {b.monetization || "₺350 Kazandırdı"}
                    </span>
                  </div>

                  <h5 className="fw-bold text-white mb-2">{b.title}</h5>
                  <p className="text-white-50 small flex-grow-1">
                    {b.excerpt || b.content?.slice(0, 130) + "..."}
                  </p>

                  <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25">
                    <span className="small text-white-50"><i className="bi bi-clock me-1" /> {b.readTime || "5 dk okuma"}</span>
                    <Link to={`/blog/${b.id}`} className="btn btn-primary btn-sm rounded-pill px-3">
                      Makaleyi Oku
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DIRECT MESSAGE (DM) MODAL */}
      {showDmModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-2xl overflow-hidden" style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div className="modal-header border-bottom border-secondary border-opacity-25 px-4 py-3">
                <div className="d-flex align-items-center gap-3">
                  <img src={profile.avatar} alt={profile.fullName} className="rounded-circle object-fit-cover" style={{ width: "40px", height: "40px" }} />
                  <div>
                    <h6 className="fw-bold mb-0 text-white">{profile.fullName}</h6>
                    <small className="text-success" style={{ fontSize: "11px" }}>● Çevrimiçi • Doğrudan Mesaj</small>
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDmModal(false)} />
              </div>

              <form onSubmit={handleSendDm}>
                <div className="modal-body p-4">
                  <label className="form-label text-white-50 small fw-semibold">Mesajınız</label>
                  <textarea
                    rows={4}
                    className="form-control bg-dark text-white border-secondary border-opacity-50 rounded-3"
                    placeholder={`@${profile.username} kullanıcısına mesaj yazın...`}
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

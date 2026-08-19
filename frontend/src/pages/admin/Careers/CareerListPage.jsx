// src/pages/admin/Careers/CareerListPage.jsx
import { useState } from "react";
import toast from "react-hot-toast";

const INITIAL_JOBS = [
  {
    id: 1,
    title: "Senior Full-Stack Developer (.NET 10 & React)",
    department: "Yazılım Geliştirme",
    location: "Yozgat / Bozok Teknopark (Hibrit)",
    type: "Tam Zamanlı",
    experience: "3+ Yıl",
    description: "ASP.NET Core Web API, React 19 ve PostgreSQL mimarisiyle kurumsal projeler geliştirecek deneyimli geliştirici aranıyor.",
    isActive: true,
    applicationCount: 12,
    createdAt: "2026-08-01",
  },
  {
    id: 2,
    title: "Frontend Developer Stajyeri (React & Tailwind)",
    department: "Frontend Ekibi",
    location: "Bozok Teknopark / Yerinde",
    type: "Stajyer / Yarı Zamanlı",
    experience: "Yeni Mezun / Öğrenci",
    description: "Modern JavaScript, React ve CSS kütüphanelerine hakim, öğrenmeye açık stajyer ekip arkadaşı arıyoruz.",
    isActive: true,
    applicationCount: 28,
    createdAt: "2026-08-10",
  },
  {
    id: 3,
    title: "Yapay Zekâ ve Veri Mühendisi (Python & LLM)",
    department: "Ar-Ge & AI",
    location: "Uzaktan (Remote)",
    type: "Tam Zamanlı",
    experience: "2+ Yıl",
    description: "OpenAI GPT-4o entegrasyonları, RAG pipeline ve kurumsal chatbot sistemleri geliştirecek mühendis.",
    isActive: false,
    applicationCount: 7,
    createdAt: "2026-07-15",
  },
];

const INITIAL_APPLICATIONS = [
  {
    id: 101,
    jobTitle: "Senior Full-Stack Developer (.NET 10 & React)",
    applicantName: "Ali Can Yılmaz",
    email: "alican@gmail.com",
    phone: "+90 532 999 88 77",
    experience: "4 Yıl Deneyim",
    coverLetter: "Merhaba, .NET ve React projelerinde 4 yıldır aktif çalışıyorum. TechNova projelerinde yer almaktan mutluluk duyarım.",
    cvUrl: "alican-cv.pdf",
    status: "interview", // new, in_review, interview, accepted, rejected
    appliedAt: "2026-08-15 14:30",
  },
  {
    id: 102,
    jobTitle: "Frontend Developer Stajyeri (React & Tailwind)",
    applicantName: "Ceren Demir",
    email: "ceren.demir@bozok.edu.tr",
    phone: "+90 544 111 22 33",
    experience: "Bozok Üniv. Bilgisayar Müh. 4. Sınıf",
    coverLetter: "Bozok Üniversitesi'nde son sınıf öğrencisiyim. Teknopark ekibinizde staj yaparak kendimi geliştirmek istiyorum.",
    cvUrl: "ceren-demir-cv.pdf",
    status: "new",
    appliedAt: "2026-08-17 10:15",
  },
  {
    id: 103,
    jobTitle: "Yapay Zekâ ve Veri Mühendisi (Python & LLM)",
    applicantName: "Hakan Özkan",
    email: "hakan.ai@tech.com",
    phone: "+90 555 777 44 11",
    experience: "3 Yıl ML / NLP",
    coverLetter: "FastAPI ve LangChain ile kurumsal chatbot projeleri geliştirdim. CV'mi inceleyebilirsiniz.",
    cvUrl: "hakan-ozkan-cv.pdf",
    status: "in_review",
    appliedAt: "2026-08-12 16:45",
  },
];

export default function CareerListPage() {
  const [activeTab, setActiveTab] = useState("jobs"); // 'jobs' or 'applications'
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);

  // Job Modal State
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "Yazılım Geliştirme",
    location: "Yozgat / Bozok Teknopark",
    type: "Tam Zamanlı",
    experience: "1+ Yıl",
    description: "",
    isActive: true,
  });

  const handleOpenJobModal = (job = null) => {
    if (job) {
      setSelectedJob(job);
      setJobForm(job);
    } else {
      setSelectedJob(null);
      setJobForm({
        title: "",
        department: "Yazılım Geliştirme",
        location: "Yozgat / Bozok Teknopark",
        type: "Tam Zamanlı",
        experience: "1+ Yıl",
        description: "",
        isActive: true,
      });
    }
    setShowJobModal(true);
  };

  const handleSaveJob = (e) => {
    e.preventDefault();
    if (selectedJob) {
      setJobs(jobs.map((j) => (j.id === selectedJob.id ? { ...j, ...jobForm } : j)));
      toast.success("İş ilanı başarıyla güncellendi.");
    } else {
      const newJob = {
        id: Date.now(),
        ...jobForm,
        applicationCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setJobs([newJob, ...jobs]);
      toast.success("Yeni iş ilanı başarıyla yayınlandı!");
    }
    setShowJobModal(false);
  };

  const handleToggleJobStatus = (id) => {
    setJobs(
      jobs.map((j) => {
        if (j.id === id) {
          const next = !j.isActive;
          toast.success(`İlan ${next ? "yayına alındı" : "yayından kaldırıldı"}.`);
          return { ...j, isActive: next };
        }
        return j;
      })
    );
  };

  const handleDeleteJob = (id) => {
    if (window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) {
      setJobs(jobs.filter((j) => j.id !== id));
      toast.success("İlan silindi.");
    }
  };

  const handleUpdateApplicationStatus = (appId, newStatus) => {
    setApplications(
      applications.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    toast.success("Başvuru durumu güncellendi.");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1">🆕 Yeni Başvuru</span>;
      case "in_review":
        return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1">👀 İnceleniyor</span>;
      case "interview":
        return <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2 py-1">🎙️ Mülakata Çağrıldı</span>;
      case "accepted":
        return <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">✅ İşe Alındı</span>;
      case "rejected":
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">❌ Reddedildi</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="pb-5">
      {/* HEADER & SUMMARY STATS */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-2 py-1">
              👥 İK & Yetenek Yönetimi
            </span>
          </div>
          <h1 className="h3 fw-bold mb-1 text-dark">Kariyer & İlan Yönetim Merkezi</h1>
          <p className="text-secondary small mb-0">
            Şirket iş ve staj ilanlarını yayınlayın, gelen CV başvurularını değerlendirin.
          </p>
        </div>

        <button
          className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm d-flex align-items-center gap-2"
          onClick={() => handleOpenJobModal()}
        >
          <i className="bi bi-plus-circle-fill" /> Yeni İlan Yayınla
        </button>
      </div>

      {/* STATS TILES */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-3 bg-primary bg-opacity-10 text-primary p-3 fs-4">
                <i className="bi bi-briefcase-fill" />
              </div>
              <div>
                <div className="h4 fw-bold mb-0 text-dark">{jobs.length}</div>
                <small className="text-secondary">Toplam İlan</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-3 bg-success bg-opacity-10 text-success p-3 fs-4">
                <i className="bi bi-check-circle-fill" />
              </div>
              <div>
                <div className="h4 fw-bold mb-0 text-dark">{jobs.filter((j) => j.isActive).length}</div>
                <small className="text-secondary">Aktif Yayında</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-3 bg-info bg-opacity-10 text-info p-3 fs-4">
                <i className="bi bi-file-earmark-person-fill" />
              </div>
              <div>
                <div className="h4 fw-bold mb-0 text-dark">{applications.length}</div>
                <small className="text-secondary">Gelen Başvuru & CV</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-3 bg-warning bg-opacity-10 text-warning p-3 fs-4">
                <i className="bi bi-person-video3" />
              </div>
              <div>
                <div className="h4 fw-bold mb-0 text-dark">{applications.filter((a) => a.status === "interview").length}</div>
                <small className="text-secondary">Mülakat Aşamasında</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS (İLANLAR ↔ BAŞVURULAR) */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-bottom p-0">
          <ul className="nav nav-tabs border-0 px-3 pt-2 gap-2" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link border-0 py-3 px-4 fw-semibold ${activeTab === "jobs" ? "active text-primary border-bottom border-primary border-3" : "text-secondary"}`}
                onClick={() => setActiveTab("jobs")}
              >
                <i className="bi bi-briefcase me-2" />
                Açık İş & Staj İlanları ({jobs.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 py-3 px-4 fw-semibold ${activeTab === "applications" ? "active text-primary border-bottom border-primary border-3" : "text-secondary"}`}
                onClick={() => setActiveTab("applications")}
              >
                <i className="bi bi-people me-2" />
                Gelen CV Başvuruları ({applications.length})
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body p-0">
          {/* TAB 1: JOBS TABLE */}
          {activeTab === "jobs" && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">İlan Başlığı & Departman</th>
                    <th scope="col">Lokasyon</th>
                    <th scope="col">Çalışma Türü</th>
                    <th scope="col">Başvuru Sayısı</th>
                    <th scope="col">Durum</th>
                    <th scope="col" className="text-end pe-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark">{job.title}</div>
                        <small className="text-muted">{job.department} • {job.experience}</small>
                      </td>
                      <td className="text-secondary small">{job.location}</td>
                      <td>
                        <span className="badge text-bg-light border">{job.type}</span>
                      </td>
                      <td>
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill fw-bold">
                          {job.applicationCount} Aday
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleJobStatus(job.id)}
                          className={`btn btn-sm rounded-pill px-3 fw-semibold ${job.isActive ? "btn-outline-success" : "btn-outline-secondary"}`}
                        >
                          {job.isActive ? "🟢 Yayında" : "⚪ Pasif"}
                        </button>
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group">
                          <button
                            className="btn btn-outline-primary btn-sm rounded-pill px-3 me-2"
                            onClick={() => handleOpenJobModal(job)}
                          >
                            <i className="bi bi-pencil" /> Düzenle
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm rounded-pill px-2"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: APPLICATIONS & CV REVIEW */}
          {activeTab === "applications" && (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">Aday Bilgisi</th>
                    <th scope="col">Başvurulan Pozisyon</th>
                    <th scope="col">Deneyim / Üniversite</th>
                    <th scope="col">Ön Yazı / CV</th>
                    <th scope="col">Başvuru Durumu</th>
                    <th scope="col" className="text-end pe-4">Değerlendirme</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="ps-4">
                        <div className="fw-bold text-dark">{app.applicantName}</div>
                        <small className="text-muted d-block">{app.email}</small>
                        <small className="text-secondary">{app.phone}</small>
                      </td>
                      <td className="fw-semibold text-dark small" style={{ maxWidth: "220px" }}>
                        {app.jobTitle}
                      </td>
                      <td className="text-secondary small">{app.experience}</td>
                      <td style={{ maxWidth: "240px" }}>
                        <div className="text-truncate small text-secondary mb-1" title={app.coverLetter}>
                          "{app.coverLetter}"
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm rounded-pill py-0 px-2 small"
                          onClick={() => toast.success(`📄 ${app.cvUrl} dosyası önizleniyor.`)}
                        >
                          <i className="bi bi-file-earmark-pdf me-1" /> CV'yi İncele
                        </button>
                      </td>
                      <td>{getStatusBadge(app.status)}</td>
                      <td className="text-end pe-4">
                        <select
                          className="form-select form-select-sm rounded-pill d-inline-block w-auto"
                          value={app.status}
                          onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                        >
                          <option value="new">Yeni Başvuru</option>
                          <option value="in_review">İnceleniyor</option>
                          <option value="interview">Mülakata Çağır</option>
                          <option value="accepted">İşe Alındı (Kabul)</option>
                          <option value="rejected">Reddet</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* JOB CREATE / EDIT MODAL */}
      {showJobModal && (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-light px-4 py-3 border-bottom">
                <h5 className="modal-title fw-bold text-dark fs-6">
                  <i className="bi bi-briefcase me-2 text-primary" />
                  {selectedJob ? "İş İlanını Düzenle" : "Yeni İş / Staj İlanı Yayınla"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowJobModal(false)} />
              </div>

              <form onSubmit={handleSaveJob}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-secondary">İlan Başlığı</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="Örn: Senior Backend Developer (.NET 10)"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-secondary">Departman</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={jobForm.department}
                        onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-secondary">Lokasyon</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-secondary">Çalışma Türü</label>
                      <select
                        className="form-select rounded-3"
                        value={jobForm.type}
                        onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                      >
                        <option value="Tam Zamanlı">Tam Zamanlı</option>
                        <option value="Yarı Zamanlı">Yarı Zamanlı</option>
                        <option value="Stajyer">Stajyer</option>
                        <option value="Proje Bazlı / Freelance">Proje Bazlı / Freelance</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-secondary">Deneyim Seviyesi</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        value={jobForm.experience}
                        onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                        placeholder="Örn: 2+ Yıl veya Yeni Mezun"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-secondary">İş Tanımı ve Aranan Nitelikler</label>
                      <textarea
                        rows={4}
                        className="form-control rounded-3"
                        value={jobForm.description}
                        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                        placeholder="Adaylardan beklenen beceriler, kullanılacak teknolojiler ve görev tanımı..."
                        required
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="jobActiveSwitch"
                          checked={jobForm.isActive}
                          onChange={(e) => setJobForm({ ...jobForm, isActive: e.target.checked })}
                        />
                        <label className="form-check-label fw-semibold small" htmlFor="jobActiveSwitch">
                          İlanı hemen web sitesinde yayına al
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3 border-top">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowJobModal(false)}>
                    Vazgeç
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-5 fw-semibold">
                    {selectedJob ? "İlanı Güncelle" : "İlanı Yayınla"}
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

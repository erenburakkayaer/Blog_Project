import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";

function CareerPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/api/careers", { params: { page: 1, pageSize: 50 } })
      .then((res) => {
        // Sadece aktif ilanları göster
        const active = (res.data.items ?? []).filter((c) => c.status === "active");
        setCareers(active);
      })
      .catch(() => setCareers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-dark text-light py-5">
        <div className="container py-4">
          <span className="badge rounded-pill bg-primary mb-3">İnsan Kaynakları</span>
          <h1 className="display-5 fw-bold mb-3">Kariyer</h1>
          <p className="lead text-white-50 mb-0" style={{ maxWidth: 600 }}>
            Yenilikçi teknolojiler geliştiren ekibimize katılın. Açık pozisyonları aşağıdan inceleyebilirsiniz.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : careers.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-person-badge" style={{ fontSize: 48 }} />
              <p className="mt-3">Şu an için açık bir ilanımız bulunmuyor. Lütfen daha sonra tekrar kontrol edin.</p>
            </div>
          ) : (
            <div className="row g-4">
              {careers.map((career) => (
                <div className="col-12" key={career.id}>
                  <div className="card shadow-sm border-0">
                    <div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                      <div>
                        <h2 className="h4 fw-bold mb-1">{career.title}</h2>
                        <div className="text-secondary small mb-3">
                          <span className="me-3"><i className="bi bi-briefcase me-1" /> {career.type || "Tam Zamanlı"}</span>
                          <span className="me-3"><i className="bi bi-geo-alt me-1" /> {career.location || "İstanbul / Hibrit"}</span>
                          <span><i className="bi bi-calendar3 me-1" /> {new Date(career.createdAt).toLocaleDateString("tr-TR")}</span>
                        </div>
                        <p className="mb-0">{career.description}</p>
                      </div>
                      <div className="text-md-end shrink-0">
                        <Link to="/iletisim" className="btn btn-primary px-4">
                          Hemen Başvur
                        </Link>
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

export default CareerPage;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../api/apiClient";

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/api/services", { params: { page: 1, pageSize: 50 } })
      .then((res) => setServices(res.data.items ?? []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const icons = [
    "bi-code-slash", "bi-phone", "bi-cpu", "bi-shield-check",
    "bi-cloud", "bi-graph-up", "bi-gear", "bi-lightning",
  ];

  return (
    <>
      <section className="bg-dark text-light py-5">
        <div className="container py-4">
          <span className="badge rounded-pill bg-primary mb-3">Neler Yapıyoruz</span>
          <h1 className="display-5 fw-bold mb-3">Hizmetlerimiz</h1>
          <p className="lead text-white-50 mb-0" style={{ maxWidth: 600 }}>
            Web, mobil, yapay zekâ ve siber güvenlik alanlarında kurumsal çözümler.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-inbox" style={{ fontSize: 48 }} />
              <p className="mt-3">Henüz hizmet eklenmemiş.</p>
            </div>
          ) : (
            <div className="row g-4">
              {services.map((service, i) => (
                <div className="col-md-6 col-lg-3" key={service.id}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 mb-3"
                        style={{ width: 52, height: 52 }}
                      >
                        <i
                          className={`bi ${service.icon || icons[i % icons.length]} text-primary`}
                          style={{ fontSize: 24 }}
                        />
                      </div>
                      <h2 className="h5 fw-bold">{service.title}</h2>
                      <p className="text-secondary small mb-0">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link className="btn btn-primary btn-lg" to="/teklif-al">
              <i className="bi bi-send me-2" />
              Teklif Al
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;

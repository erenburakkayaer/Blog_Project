import { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";

function ReferencesPage() {
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/api/references", { params: { page: 1, pageSize: 50 } })
      .then((res) => setReferences(res.data.items ?? []))
      .catch(() => setReferences([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-dark text-light py-5">
        <div className="container py-4 text-center">
          <h1 className="display-5 fw-bold mb-3">Referanslarımız</h1>
          <p className="lead text-white-50 mx-auto" style={{ maxWidth: 600 }}>
            Birlikte çalıştığımız markalar ve iş ortaklarımız.
          </p>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : references.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-building" style={{ fontSize: 48 }} />
              <p className="mt-3">Henüz referans eklenmemiş.</p>
            </div>
          ) : (
            <div className="row g-4 align-items-center justify-content-center">
              {references.map((ref) => (
                <div className="col-6 col-md-4 col-lg-3 text-center" key={ref.id}>
                  <div className="card border-0 shadow-sm p-4 h-100 d-flex justify-content-center align-items-center bg-white" style={{ minHeight: "150px" }}>
                    {ref.logoUrl ? (
                      <img
                        src={ref.logoUrl}
                        alt={ref.name}
                        className="img-fluid"
                        style={{ maxHeight: "80px", opacity: 0.8, filter: "grayscale(100%)", transition: "all 0.3s ease" }}
                        onMouseOver={(e) => { e.currentTarget.style.filter = "grayscale(0%)"; e.currentTarget.style.opacity = "1"; }}
                        onMouseOut={(e) => { e.currentTarget.style.filter = "grayscale(100%)"; e.currentTarget.style.opacity = "0.8"; }}
                      />
                    ) : (
                      <h3 className="h6 fw-bold mb-0 text-secondary">{ref.name}</h3>
                    )}
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

export default ReferencesPage;

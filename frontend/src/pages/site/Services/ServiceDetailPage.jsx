import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../../../api/apiClient";

function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await apiClient.get(`/api/companyServices/${id}`);
        setService(res.data);
      } catch {
        toast.error("Hizmet yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-5">
        <h2>Hizmet bulunamadı.</h2>
        <Link to="/hizmetler" className="btn btn-primary mt-3">Hizmetlerimize Dön</Link>
      </div>
    );
  }

  return (
    <>
      <section className="bg-dark text-light py-5 text-center">
        <div className="container py-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 mb-3"
            style={{ width: 80, height: 80 }}
          >
            <i className={`bi ${service.icon || "bi-gear"} text-primary`} style={{ fontSize: 40 }} />
          </div>
          <h1 className="display-4 fw-bold">{service.title}</h1>
          <p className="lead text-white-50 mt-3 mx-auto" style={{ maxWidth: 700 }}>
            {service.description}
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="fs-5" dangerouslySetInnerHTML={{ __html: service.content || service.description }} />
          
          <div className="mt-5 p-4 bg-light rounded text-center shadow-sm">
            <h3 className="fw-bold mb-3">Bu hizmete mi ihtiyacınız var?</h3>
            <p className="text-secondary mb-4">Projeleriniz için en uygun çözümleri sunmak için buradayız.</p>
            <Link to="/teklif-al" className="btn btn-primary btn-lg px-5">
              Hemen Teklif Alın
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default ServiceDetailPage;

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../../../api/apiClient";

function OfferPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    phone: "",
    email: "",
    companyName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/api/offers", formData);
      toast.success("Teklif talebiniz başarıyla alındı!");
      setFormData({ title: "", description: "", budget: "", phone: "", email: "", companyName: "" });
    } catch {
      toast.error("Teklif talebi gönderilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-dark text-light py-5">
        <div className="container py-4 text-center">
          <h1 className="display-5 fw-bold mb-3">Teklif Al</h1>
          <p className="lead text-white-50 mx-auto" style={{ maxWidth: 600 }}>
            Projenizin ayrıntılarını paylaşın, size özel teklif hazırlayalım.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="card shadow-sm border-0 p-4 p-md-5">
            <h3 className="mb-4">Proje Detayları</h3>
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-12">
                  <label className="form-label fw-semibold">Proje Başlığı</label>
                  <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label fw-semibold">E-Posta</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Telefon</label>
                  <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Şirket Adı</label>
                  <input type="text" className="form-control" name="companyName" value={formData.companyName} onChange={handleChange} />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Tahmini Bütçe</label>
                  <select className="form-select" name="budget" value={formData.budget} onChange={handleChange} required>
                    <option value="">Seçiniz...</option>
                    <option value="10k-50k">10.000₺ - 50.000₺</option>
                    <option value="50k-100k">50.000₺ - 100.000₺</option>
                    <option value="100k+">100.000₺ Üzeri</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Proje Açıklaması</label>
                  <textarea className="form-control" rows="5" name="description" value={formData.description} onChange={handleChange} required placeholder="Projenizin detaylarını, ihtiyaçlarınızı ve hedeflerinizi anlatın..."></textarea>
                </div>

                <div className="col-12 mt-4 text-center">
                  <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                    {loading ? "Gönderiliyor..." : "Teklif Talebini Gönder"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default OfferPage;

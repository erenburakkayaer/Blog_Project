import { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../../../api/apiClient";

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/api/messages", {
        ...formData,
        senderIp: "127.0.0.1", 
      });
      toast.success("Mesajınız başarıyla gönderildi!");
      setFormData({ senderName: "", senderEmail: "", subject: "", message: "" });
    } catch {
      toast.error("Mesaj gönderilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-dark text-light py-5">
        <div className="container py-4 text-center">
          <h1 className="display-5 fw-bold mb-3">İletişim</h1>
          <p className="lead text-white-50 mx-auto" style={{ maxWidth: 600 }}>
            Projeleriniz ve sorularınız için bizimle iletişime geçin.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-5">
              <h2 className="fw-bold mb-4">Bizimle İletişime Geçin</h2>
              <p className="text-secondary mb-4">
                Yeni bir proje fikriniz mi var? Veya sadece merhaba demek mi
                istiyorsunuz? Aşağıdaki formu doldurarak bize ulaşabilirsiniz.
              </p>
              
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                  <i className="bi bi-geo-alt" />
                </div>
                <div>
                  <h6 className="mb-1">Adres</h6>
                  <p className="text-secondary mb-0">Teknokent, İstanbul</p>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                  <i className="bi bi-envelope" />
                </div>
                <div>
                  <h6 className="mb-1">E-Posta</h6>
                  <p className="text-secondary mb-0">info@technova.com</p>
                </div>
              </div>

            </div>

            <div className="col-lg-7">
              <div className="card shadow-sm border-0 p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Adınız Soyadınız</label>
                      <input type="text" className="form-control" name="senderName" value={formData.senderName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">E-Posta Adresi</label>
                      <input type="email" className="form-control" name="senderEmail" value={formData.senderEmail} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Konu</label>
                      <input type="text" className="form-control" name="subject" value={formData.subject} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Mesajınız</label>
                      <textarea className="form-control" rows="5" name="message" value={formData.message} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Gönderiliyor..." : "Mesaj Gönder"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;

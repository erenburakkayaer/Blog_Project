import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return "Günaydın";
  if (currentHour < 18) return "İyi günler";
  return "İyi akşamlar";
};

function DashboardWelcome({
  adminName,
  totalContent,
  publishedContent,
  draftContent,
}) {
  const [balance, setBalance] = useState(1450.0);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [iban, setIban] = useState("TR68 0006 2000 0000 1234 5678 90");
  const [bankName, setBankName] = useState("Ziraat Bankası");
  const [amount, setAmount] = useState("1450");
  const [submitting, setSubmitting] = useState(false);

  const handlePayoutSubmit = (e) => {
    e.preventDefault();
    const reqAmount = parseFloat(amount);
    if (!reqAmount || reqAmount < 500) {
      toast.error("Minimum çekim tutarı ₺500'dir.");
      return;
    }
    if (reqAmount > balance) {
      toast.error("Çekim tutarı mevcut bakiyenizden fazla olamaz.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setBalance((prev) => prev - reqAmount);
      setSubmitting(false);
      setShowPayoutModal(false);
      toast.success(`💸 ₺${reqAmount.toLocaleString("tr-TR")} ödeme talebiniz ${bankName} (${iban.slice(-4)}) hesabına işleme alındı!`);
    }, 600);
  };

  return (
    <section className="dashboard-welcome">
      <div className="dashboard-welcome__content">
        <span className="dashboard-welcome__badge">
          <i className="bi bi-stars" aria-hidden="true" />
          Yönetim Merkezi
        </span>

        <h1 className="dashboard-welcome__title">
          {getGreeting()}, {adminName}
        </h1>

        <p className="dashboard-welcome__description">
          Uslukılıç Yazılım içeriklerini, projelerini ve yayın durumunu tek bir merkezden yönetin.
        </p>

        <div className="dashboard-welcome__actions">
          <Link to="/admin/blog/yeni" className="btn btn-light">
            <i className="bi bi-file-earmark-plus me-2" aria-hidden="true" />
            Yeni Blog
          </Link>

          <Link to="/admin/projeler/yeni" className="btn btn-outline-light">
            <i className="bi bi-folder-plus me-2" aria-hidden="true" />
            Yeni Proje
          </Link>
        </div>
      </div>

      <div className="dashboard-welcome__summary">
        <div className="dashboard-welcome__summary-item">
          <span>Toplam içerik</span>
          <strong>{totalContent}</strong>
        </div>

        <div className="dashboard-welcome__summary-divider" />

        <div className="dashboard-welcome__summary-item">
          <span>Yayında</span>
          <strong>{publishedContent}</strong>
        </div>

        <div className="dashboard-welcome__summary-divider" />

        <div className="dashboard-welcome__summary-item">
          <span>Taslak</span>
          <strong>{draftContent}</strong>
        </div>

        <div className="dashboard-welcome__summary-divider" />

        <div className="dashboard-welcome__summary-item text-start">
          <span style={{ color: "#34d399", fontWeight: 600 }}>Yazar Bakiyesi</span>
          <strong style={{ color: "#34d399", fontSize: "1.2rem" }}>
            ₺{balance.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
          </strong>
          <button
            className="btn btn-sm btn-success mt-1 py-0 px-2"
            style={{ fontSize: "0.72rem", borderRadius: 6 }}
            onClick={() => setShowPayoutModal(true)}
          >
            <i className="bi bi-wallet2 me-1" /> Ödeme Talep Et
          </button>
        </div>
      </div>

      <div className="dashboard-welcome__shape dashboard-welcome__shape--one" />
      <div className="dashboard-welcome__shape dashboard-welcome__shape--two" />

      {/* PAYOUT MODAL */}
      {showPayoutModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content surface-card p-4" style={{ borderRadius: 24 }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-white">
                  <i className="bi bi-wallet2 text-success me-2" />
                  Yazar Bakiyesi Ödeme Talebi
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPayoutModal(false)} />
              </div>
              <div className="modal-body py-3">
                <div className="alert alert-success small mb-3">
                  Mevcut Çekilebilir Bakiye: <strong>₺{balance.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}</strong>
                </div>

                <form onSubmit={handlePayoutSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">IBAN Numarası *</label>
                    <input
                      type="text"
                      className="form-control contact-input"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Banka Adı *</label>
                    <input
                      type="text"
                      className="form-control contact-input"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Çekilecek Tutar (₺) *</label>
                    <input
                      type="number"
                      className="form-control contact-input"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="500"
                      max={balance}
                      required
                    />
                    <div className="form-text text-secondary small">Minimum çekim tutarı ₺500'dir.</div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowPayoutModal(false)}>İptal</button>
                    <button type="submit" className="btn btn-success fw-bold px-4" disabled={submitting}>
                      {submitting ? "İşleniyor..." : "Talebi Gönder"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

DashboardWelcome.propTypes = {
  adminName: PropTypes.string,
  totalContent: PropTypes.number,
  publishedContent: PropTypes.number,
  draftContent: PropTypes.number,
};

DashboardWelcome.defaultProps = {
  adminName: "Yönetici",
  totalContent: 0,
  publishedContent: 0,
  draftContent: 0,
};

export default DashboardWelcome;

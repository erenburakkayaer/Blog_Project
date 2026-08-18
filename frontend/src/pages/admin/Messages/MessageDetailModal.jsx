// src/components/admin/messages/MessageDetailModal.jsx
import { useState } from "react";
import {
  BsEnvelope,
  BsTelephone,
  BsCalendar,
  BsPerson,
  BsSend,
  BsChatSquareText,
} from "react-icons/bs";
import toast from "react-hot-toast";
import { messageService } from "../../../services/messageService";

export default function MessageDetailModal({ message, onClose }) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState("detail"); // "detail" veya "reply"

  if (!message) return null;

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error("Lütfen bir yanıt yazın.");
      return;
    }

    setSending(true);
    try {
      await messageService.reply(message.id, replyText.trim());

      toast.success("Yanıtınız kaydedildi.");
      setReplyText("");
      onClose();
    } catch {
      toast.error("Yanıt gönderilirken bir hata oluştu.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="modal show fade d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg">
          {/* Modal Header */}
          <div className="modal-header bg-light px-4 py-3">
            <div>
              <span className="badge bg-primary-subtle text-primary mb-1">
                Gelen Mesaj Detayı
              </span>
              <h5 className="modal-title text-truncate fw-bold pe-3 text-dark">
                {message.subject}
              </h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Sekme Butonları (Detay / Yanıtla) */}
          <div className="px-4 pt-3 border-bottom bg-light">
            <ul className="nav nav-tabs border-0 gap-2">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link border-0 rounded-top ${activeTab === "detail" ? "active fw-semibold bg-white shadow-sm" : "text-muted"}`}
                  onClick={() => setActiveTab("detail")}
                >
                  <BsChatSquareText className="me-2" /> Mesaj İçeriği
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link border-0 rounded-top ${activeTab === "reply" ? "active fw-semibold bg-white shadow-sm" : "text-muted"}`}
                  onClick={() => setActiveTab("reply")}
                >
                  <BsSend className="me-2" /> Hızlı Yanıtla
                </button>
              </li>
            </ul>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {activeTab === "detail" ? (
              <>
                <div className="row mb-4 bg-light p-3 rounded mx-0 g-3 border">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center text-muted mb-2">
                      <BsPerson className="me-2 text-primary" />
                      <span className="fw-semibold text-dark">
                        {message.fullName}
                      </span>
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      <BsEnvelope className="me-2 text-primary" />
                      <a
                        href={`mailto:${message.email}`}
                        className="text-decoration-none text-dark"
                      >
                        {message.email}
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center text-muted mb-2">
                      <BsTelephone className="me-2 text-primary" />
                      <span>{message.phone || "Belirtilmemiş"}</span>
                    </div>
                    <div className="d-flex align-items-center text-muted">
                      <BsCalendar className="me-2 text-primary" />
                      <span>
                        {new Date(message.createdAt).toLocaleString("tr-TR")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">
                    MESAJ METNİ
                  </label>
                  <div
                    className="p-3 border rounded bg-white text-secondary"
                    style={{
                      minHeight: "130px",
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.6",
                    }}
                  >
                    {message.message}
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSendReply}>
                <div className="alert alert-info py-2 small mb-3">
                  <i className="bi bi-info-circle me-1"></i> Bu yanıt sisteme
                  kaydedilir; <strong>{message.email}</strong> adresine
                  otomatik e-posta gönderimi şu an desteklenmiyor.
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">
                    ALICI
                  </label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={`${message.fullName} <${message.email}>`}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">
                    YANITINIZ
                  </label>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Kullanıcıya iletmek istediğiniz yanıtı buraya yazın..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={sending}
                  >
                    {sending ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <BsSend className="me-1" /> Yanıtı Gönder
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer bg-light px-4 py-3">
            {activeTab === "detail" && (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => setActiveTab("reply")}
              >
                <BsSend className="me-1" /> Bu Mesajı Yanıtla
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary px-3"
              onClick={onClose}
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

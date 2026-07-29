// src/components/admin/messages/MessageTable.jsx
import {
  BsEnvelope,
  BsEnvelopeOpen,
  BsStar,
  BsStarFill,
  BsEye,
  BsTrash,
} from "react-icons/bs";

export default function MessageTable({
  messages,
  onViewDetail,
  onToggleRead,
  onToggleImportant,
  onDelete,
}) {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p>Henüz görüntülenecek mesaj bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ width: "40px" }}></th>
            <th>Gönderen</th>
            <th>Konu</th>
            <th>Tarih</th>
            <th>Durum</th>
            <th className="text-end" style={{ width: "150px" }}>
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => {
            const isUnread = msg.status === "unread";
            return (
              <tr key={msg.id} className={isUnread ? "fw-bold bg-light" : ""}>
                <td className="text-center">
                  <button
                    className="btn btn-link p-0 text-warning"
                    onClick={() => onToggleImportant(msg.id)}
                    title={
                      msg.isImportant
                        ? "Önemli İşaretini Kaldır"
                        : "Önemli Olarak İşaretle"
                    }
                  >
                    {msg.isImportant ? (
                      <BsStarFill size={16} />
                    ) : (
                      <BsStar size={16} className="text-muted" />
                    )}
                  </button>
                </td>
                <td>
                  <div>{msg.fullName}</div>
                  <small className="text-muted fw-normal">{msg.email}</small>
                </td>
                <td>
                  <span
                    className="text-truncate d-inline-block"
                    style={{ maxWidth: "250px" }}
                  >
                    {msg.subject}
                  </span>
                </td>
                <td>
                  <small className="text-muted">
                    {new Date(msg.createdAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </td>
                <td>
                  {isUnread ? (
                    <span className="badge bg-primary">Okunmadı</span>
                  ) : msg.status === "archived" ? (
                    <span className="badge bg-secondary">Arşivlendi</span>
                  ) : (
                    <span className="badge bg-success">Okundu</span>
                  )}
                </td>
                <td className="text-end">
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => onToggleRead(msg.id)}
                      title={
                        isUnread
                          ? "Okundu Olarak İşaretle"
                          : "Okunmadı Olarak İşaretle"
                      }
                    >
                      {isUnread ? <BsEnvelopeOpen /> : <BsEnvelope />}
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => onViewDetail(msg)}
                      title="Mesajı Oku"
                    >
                      <BsEye />
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => onDelete(msg.id)}
                      title="Sil"
                    >
                      <BsTrash />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// src/pages/admin/Users/UserTable.jsx
import PropTypes from "prop-types";
import StatusBadge from "../../../components/ui/StatusBadge";
import { USER_ROLES } from "../../../services/userService";

export default function UserTable({ users, onEdit, onDelete }) {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-people display-4 mb-3 d-block text-secondary" />
        <p className="mb-0">Henüz kayıtlı kullanıcı bulunmuyor.</p>
      </div>
    );
  }

  const getRoleBadge = (roleKey) => {
    const found = USER_ROLES.find((r) => r.key === roleKey);
    if (found) {
      return (
        <span className={`badge bg-${found.color} bg-opacity-10 text-${found.color} border border-${found.color} border-opacity-25 px-2 py-1`}>
          {found.badge}
        </span>
      );
    }
    return <span className="badge text-bg-secondary">{roleKey}</span>;
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col" className="ps-4">Kullanıcı & Profil</th>
            <th scope="col">E-posta</th>
            <th scope="col">Pozisyon</th>
            <th scope="col">Atanan Rol</th>
            <th scope="col">Durum</th>
            <th scope="col" className="text-end pe-4">Rol & Düzenleme</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="ps-4 fw-semibold text-dark">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold fs-6"
                    style={{ width: "38px", height: "38px" }}
                  >
                    {(user.name || user.fullName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-dark fw-bold">{user.name || user.fullName}</div>
                    <small className="text-muted" style={{ fontSize: "11px" }}>@{user.userName || "kullanici"}</small>
                  </div>
                </div>
              </td>
              <td className="text-secondary">{user.email}</td>
              <td className="text-dark small fw-medium">{user.jobTitle || "TechNova Üyesi"}</td>
              <td>{getRoleBadge(user.role)}</td>
              <td>
                <StatusBadge status={user.status} />
              </td>
              <td className="text-end pe-4">
                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary btn-sm rounded-pill px-3 me-2"
                    onClick={() => onEdit(user)}
                    title="Rolü ve Bilgileri Düzenle"
                  >
                    <i className="bi bi-shield-check me-1" /> Rolü Değiştir
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm rounded-pill px-2"
                    onClick={() => onDelete(user.id)}
                    title="Kullanıcıyı Sil"
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
  );
}

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// src/pages/admin/Users/UserTable.jsx
import PropTypes from "prop-types";
import StatusBadge from "../../../components/ui/StatusBadge";

export default function UserTable({ users, onEdit, onDelete }) {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-people display-4 mb-3 d-block text-secondary" />
        <p className="mb-0">Henüz kayıtlı kullanıcı bulunmuyor.</p>
      </div>
    );
  }

  const roleLabels = {
    admin: { label: "Yönetici", class: "text-bg-danger" },
    editor: { label: "Editör", class: "text-bg-primary" },
    author: { label: "Yazar", class: "text-bg-secondary" },
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col" className="ps-4">
              Kullanıcı
            </th>
            <th scope="col">E-posta</th>
            <th scope="col">Rol</th>
            <th scope="col">Durum</th>
            <th scope="col" className="text-end pe-4">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const roleInfo = roleLabels[user.role] || {
              label: user.role,
              class: "text-bg-secondary",
            };
            return (
              <tr key={user.id}>
                <td className="ps-4 fw-semibold text-dark">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-circle bg-light border p-2 text-primary d-flex align-items-center justify-content-center"
                      style={{ width: "38px", height: "38px" }}
                    >
                      <i className="bi bi-person" />
                    </span>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td className="text-secondary">{user.email}</td>
                <td>
                  <span className={`badge ${roleInfo.class}`}>
                    {roleInfo.label}
                  </span>
                </td>
                <td>
                  <StatusBadge status={user.status} />
                </td>
                <td className="text-end pe-4">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(user)}
                      title="Düzenle"
                    >
                      <i className="bi bi-pencil" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(user.id)}
                      title="Sil"
                    >
                      <i className="bi bi-trash" />
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

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

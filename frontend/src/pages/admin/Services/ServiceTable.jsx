// src/pages/admin/Services/ServiceTable.jsx
import PropTypes from "prop-types";
import StatusBadge from "../../../components/ui/StatusBadge";

export default function ServiceTable({ services, onEdit, onDelete }) {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-folder2-open display-4 mb-3 d-block text-secondary" />
        <p className="mb-0">Henüz kayıtlı hizmet bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col" className="ps-4">
              Hizmet Adı
            </th>
            <th scope="col">Açıklama</th>
            <th scope="col">İkon</th>
            <th scope="col">Durum</th>
            <th scope="col" className="text-end pe-4">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td className="ps-4 fw-semibold text-dark">
                <div className="d-flex align-items-center gap-2">
                  <span className="p-2 bg-light rounded border text-primary">
                    <i className={`bi ${service.icon || "bi-gear"}`} />
                  </span>
                  <span>{service.title}</span>
                </div>
              </td>
              <td
                className="text-secondary text-truncate"
                style={{ maxWidth: "300px" }}
              >
                {service.description}
              </td>
              <td>
                <code>{service.icon || "bi-gear"}</code>
              </td>
              <td>
                <StatusBadge status={service.status} />
              </td>
              <td className="text-end pe-4">
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEdit(service)}
                    title="Düzenle"
                  >
                    <i className="bi bi-pencil" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(service.id)}
                    title="Sil"
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

ServiceTable.propTypes = {
  services: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

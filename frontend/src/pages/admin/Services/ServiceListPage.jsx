// src/pages/admin/Services/ServiceListPage.jsx
import { useState, useEffect } from "react";
import { serviceService } from "../../../services/serviceService";
import ServiceTable from "./ServiceTable";
import ServiceModal from "./ServiceModal";
import PageHeader from "../../../components/ui/PageHeader";
import SearchInput from "../../../components/ui/SearchInput";
import FilterSelect from "../../../components/ui/FilterSelect";
import LoadingState from "../../../components/ui/LoadingState";
import toast from "react-hot-toast";

export default function ServiceListPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getAll();
      setServices(response.data);
    } catch {
      toast.error("Hizmetler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleSaveService = async (formData) => {
    try {
      if (selectedService) {
        await serviceService.update(selectedService.id, formData);
        toast.success("Hizmet başarıyla güncellendi.");
      } else {
        await serviceService.create(formData);
        toast.success("Yeni hizmet başarıyla eklendi.");
      }
      fetchServices();
    } catch {
      toast.error("İşlem başarısız oldu.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;

    try {
      await serviceService.delete(id);
      toast.success("Hizmet silindi.");
      fetchServices();
    } catch {
      toast.error("Silme işlemi başarısız oldu.");
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter !== "all") {
      return matchesSearch && service.status === statusFilter;
    }
    return matchesSearch;
  });

  return (
    <div className="container-fluid px-4 py-4">
      <PageHeader
        title="Hizmet Yönetimi"
        description="Web sitenizde sunulan hizmet içeriklerini buradan yönetebilirsiniz."
        actionLabel="Yeni Hizmet Ekle"
        onAction={handleOpenCreateModal}
      />

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <SearchInput
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            placeholder="Hizmet adı veya açıklamada ara..."
          />
        </div>
        <div className="col-md-4 ms-auto">
          <FilterSelect
            id="service-status-filter"
            label="Durum Filtresi"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={[
              { value: "active", label: "Aktif" },
              { value: "passive", label: "Pasif" },
            ]}
          />
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <LoadingState />
          ) : (
            <ServiceTable
              services={filteredServices}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        service={selectedService}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveService}
      />
    </div>
  );
}

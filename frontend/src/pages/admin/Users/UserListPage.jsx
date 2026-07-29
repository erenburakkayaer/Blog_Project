// src/pages/admin/Users/UserListPage.jsx
import { useState, useEffect } from "react";
import { userService } from "../../../services/userService";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import PageHeader from "../../../components/ui/PageHeader";
import SearchInput from "../../../components/ui/SearchInput";
import FilterSelect from "../../../components/ui/FilterSelect";
import LoadingState from "../../../components/ui/LoadingState";
import toast from "react-hot-toast";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response.data);
    } catch {
      toast.error("Kullanıcılar yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (formData) => {
    try {
      if (selectedUser) {
        await userService.update(selectedUser.id, formData);
        toast.success("Kullanıcı başarıyla güncellendi.");
      } else {
        await userService.create(formData);
        toast.success("Yeni kullanıcı başarıyla eklendi.");
      }
      fetchUsers();
    } catch {
      toast.error("İşlem başarısız oldu.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?"))
      return;

    try {
      await userService.delete(id);
      toast.success("Kullanıcı silindi.");
      fetchUsers();
    } catch {
      toast.error("Silme işlemi başarısız oldu.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (roleFilter !== "all") {
      return matchesSearch && user.role === roleFilter;
    }
    return matchesSearch;
  });

  return (
    <div className="container-fluid px-4 py-4">
      <PageHeader
        title="Kullanıcı Yönetimi"
        description="Sistem kullanıcılarını, rollerini ve yetkilerini buradan yönetebilirsiniz."
        actionLabel="Yeni Kullanıcı Ekle"
        onAction={handleOpenCreateModal}
      />

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <SearchInput
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            placeholder="İsim veya e-posta ile ara..."
          />
        </div>
        <div className="col-md-4 ms-auto">
          <FilterSelect
            id="user-role-filter"
            label="Rol Filtresi"
            value={roleFilter}
            onChange={(value) => setRoleFilter(value)}
            options={[
              { value: "admin", label: "Yönetici" },
              { value: "editor", label: "Editör" },
              { value: "author", label: "Yazar" },
            ]}
          />
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <LoadingState />
          ) : (
            <UserTable
              users={filteredUsers}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
}

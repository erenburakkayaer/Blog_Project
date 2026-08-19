// src/pages/admin/Messages/MessageListPage.jsx
import { useState, useEffect } from "react";
import { messageService } from "../../../services/messageService";
import MessageTable from "./MessageTable";
import MessageDetailModal from "./MessageDetailModal";
import PageHeader from "../../../components/ui/PageHeader";
import SearchInput from "../../../components/ui/SearchInput";
import FilterSelect from "../../../components/ui/FilterSelect";
import LoadingState from "../../../components/ui/LoadingState";
import toast from "react-hot-toast";

export default function MessageListPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Mesajları yükleme
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await messageService.getAll();
        setMessages(response.data);
      } catch {
        toast.error("Mesajlar yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Detay açma ve otomatik okundu işaretleme
  const handleViewDetail = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      try {
        await messageService.updateStatus(msg.id, { status: "read" });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m)),
        );
      } catch (err) {
        console.error("Durum güncellenemedi", err);
      }
    }
  };

  // Okundu / Okunmadı toggle
  const handleToggleRead = async (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;

    const newStatus = msg.status === "unread" ? "read" : "unread";
    try {
      await messageService.updateStatus(id, { status: newStatus });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)),
      );
      toast.success(
        newStatus === "read"
          ? "Mesaj okundu olarak işaretlendi."
          : "Mesaj okunmadı olarak işaretlendi.",
      );
    } catch {
      toast.error("İşlem başarısız oldu.");
    }
  };

  // Önemli yıldızı toggle
  const handleToggleImportant = async (id) => {
    try {
      await messageService.toggleImportant(id);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, isImportant: !m.isImportant } : m,
        ),
      );
    } catch {
      toast.error("İşlem başarısız oldu.");
    }
  };

  // Mesaj silme
  const handleDelete = async (id) => {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;

    try {
      await messageService.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Mesaj başarıyla silindi.");
    } catch {
      toast.error("Silme işlemi başarısız oldu.");
    }
  };

  // Arama ve Filtreleme Mantığı
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "unread")
      return matchesSearch && msg.status === "unread";
    if (statusFilter === "read") return matchesSearch && msg.status === "read";
    if (statusFilter === "important") return matchesSearch && msg.isImportant;

    return matchesSearch;
  });

  return (
    <div className="container-fluid px-4 py-4">
      <PageHeader
        title="İletişim Mesajları"
        description="Web sitesinden gelen iletişim formu mesajlarını buradan yönetebilirsiniz."
      />

      {/* Filtreleme ve Arama Alanı */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <SearchInput
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            placeholder="İsim, e-posta veya konuda ara..."
          />
        </div>
        <div className="col-md-4 ms-auto">
          <FilterSelect
            id="message-status-filter"
            label="Durum Filtresi"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={[
              { value: "unread", label: "Okunmayanlar" },
              { value: "read", label: "Okunanlar" },
              { value: "important", label: "Önemliler" },
            ]}
          />
        </div>
      </div>

      {/* Tablo Alanı */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <LoadingState />
          ) : (
            <MessageTable
              messages={filteredMessages}
              onViewDetail={handleViewDetail}
              onToggleRead={handleToggleRead}
              onToggleImportant={handleToggleImportant}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Detay Modalı */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
}

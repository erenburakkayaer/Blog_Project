import { useState, useEffect } from "react";
import { messageService } from "../../../services/messageService";
import { communityService } from "../../../services/communityService";
import MessageTable from "./MessageTable";
import MessageDetailModal from "./MessageDetailModal";
import PageHeader from "../../../components/ui/PageHeader";
import SearchInput from "../../../components/ui/SearchInput";
import FilterSelect from "../../../components/ui/FilterSelect";
import LoadingState from "../../../components/ui/LoadingState";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

export default function MessageListPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("directMessages"); // 'directMessages' or 'contactForms'
  
  // Direct Messages state
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [newDmText, setNewDmText] = useState("");

  // Contact Messages state
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const convList = communityService.getConversations();
        setConversations(convList);
        if (convList.length > 0) setSelectedConv(convList[0]);

        const res = await messageService.getAll();
        const list = Array.isArray(res) ? res : res?.data && Array.isArray(res.data) ? res.data : [];
        setMessages(list);
      } catch (e) {
        console.warn("Mesajlar yüklenemedi:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const handleDmUpdated = () => {
      const convList = communityService.getConversations();
      setConversations(convList);
      if (selectedConv) {
        const found = convList.find((c) => c.id === selectedConv.id);
        if (found) setSelectedConv(found);
      }
    };

    window.addEventListener("technova_dm_updated", handleDmUpdated);
    return () => window.removeEventListener("technova_dm_updated", handleDmUpdated);
  }, []);

  const handleSendDirectMessage = (e) => {
    e.preventDefault();
    if (!newDmText.trim() || !selectedConv) return;

    const updated = communityService.sendMessage(selectedConv.participant.username, newDmText.trim());
    setSelectedConv(updated);
    setConversations(communityService.getConversations());
    setNewDmText("");
  };

  // Contact form details
  const handleViewDetail = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      try {
        await messageService.updateStatus(msg.id, { status: "read" });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: "read" } : m))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleRead = async (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    const newStatus = msg.status === "unread" ? "read" : "unread";
    try {
      await messageService.updateStatus(id, { status: newStatus });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    } catch {
      toast.error("Durum güncellenemedi.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try {
      await messageService.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Mesaj silindi.");
    } catch {
      toast.error("Mesaj silinemedi.");
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && m.status === "unread") ||
      (statusFilter === "read" && m.status === "read") ||
      (statusFilter === "replied" && m.isReplied);
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Mesajlaşma & İletişim Merkezi"
        subtitle="LinkedIn & Instagram tarzı geliştirici mesajlaşmaları ve kurumsal müşteri talepleri."
      />

      {/* Tab Switcher */}
      <div className="d-flex rounded-3 p-1 mb-4" style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.1)", maxWidth: "550px" }}>
        <button
          type="button"
          className={`btn w-50 fw-semibold rounded-2 py-2 ${activeTab === "directMessages" ? "btn-primary text-white shadow-sm" : "btn-light text-secondary"}`}
          onClick={() => setActiveTab("directMessages")}
        >
          <i className="bi bi-chat-dots-fill me-2" />
          Doğrudan Mesajlar (DM / Sohbet)
        </button>
        <button
          type="button"
          className={`btn w-50 fw-semibold rounded-2 py-2 ${activeTab === "contactForms" ? "btn-primary text-white shadow-sm" : "btn-light text-secondary"}`}
          onClick={() => setActiveTab("contactForms")}
        >
          <i className="bi bi-inbox-fill me-2" />
          İletişim Formları ({messages.length})
        </button>
      </div>

      {/* TAB 1: LINKEDIN / INSTAGRAM STYLE DIRECT MESSAGES CHAT */}
      {activeTab === "directMessages" && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ minHeight: "560px" }}>
          <div className="row g-0" style={{ minHeight: "560px" }}>
            {/* Conversations List (Left) */}
            <div className="col-md-4 border-end bg-light bg-opacity-50 p-3">
              <div className="fw-bold text-dark small mb-3 px-2 d-flex justify-content-between align-items-center">
                <span>AKTİF SOHBETLER</span>
                <span className="badge bg-primary rounded-pill">{conversations.length}</span>
              </div>

              <div className="list-group list-group-flush gap-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    className={`list-group-item list-group-item-action border-0 rounded-3 p-3 text-start transition-all ${selectedConv?.id === conv.id ? "bg-white shadow-sm border border-primary border-opacity-25" : "bg-transparent"}`}
                    onClick={() => setSelectedConv(conv)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative">
                        <img
                          src={conv.participant.avatar}
                          alt={conv.participant.fullName}
                          className="rounded-circle object-fit-cover"
                          style={{ width: "45px", height: "45px" }}
                        />
                        {conv.participant.online && (
                          <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-white rounded-circle" />
                        )}
                      </div>

                      <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-dark small text-truncate">{conv.participant.fullName}</strong>
                          <span className="text-secondary" style={{ fontSize: "11px" }}>{conv.lastMessageTime}</span>
                        </div>
                        <p className="text-secondary small mb-0 text-truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Chat Conversation (Right) */}
            <div className="col-md-8 d-flex flex-column bg-white">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between bg-light bg-opacity-25">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={selectedConv.participant.avatar}
                        alt={selectedConv.participant.fullName}
                        className="rounded-circle object-fit-cover"
                        style={{ width: "42px", height: "42px" }}
                      />
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">{selectedConv.participant.fullName}</h6>
                        <small className="text-secondary">{selectedConv.participant.title}</small>
                      </div>
                    </div>

                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                      ● Çevrimiçi
                    </span>
                  </div>

                  {/* Messages Bubble Stream */}
                  <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-3" style={{ maxHeight: "380px" }}>
                    {selectedConv.messages?.map((msg) => (
                      <div
                        key={msg.id}
                        className={`d-flex flex-column ${msg.isMine ? "align-items-end" : "align-items-start"}`}
                      >
                        <div
                          className={`p-3 rounded-4 shadow-sm text-break ${msg.isMine ? "bg-primary text-white rounded-bottom-end-0" : "bg-light text-dark border rounded-bottom-start-0"}`}
                          style={{ maxWidth: "75%" }}
                        >
                          {msg.text}
                        </div>
                        <small className="text-secondary mt-1" style={{ fontSize: "11px" }}>
                          {msg.time} {msg.isMine && "✓✓"}
                        </small>
                      </div>
                    ))}
                  </div>

                  {/* Message Input Box */}
                  <form onSubmit={handleSendDirectMessage} className="p-3 border-top bg-light bg-opacity-25">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control rounded-start-pill py-2 px-4 border"
                        placeholder={`${selectedConv.participant.fullName} kullanıcısına mesaj yaz...`}
                        value={newDmText}
                        onChange={(e) => setNewDmText(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary rounded-end-pill px-4 fw-semibold">
                        <i className="bi bi-send-fill me-1" /> Gönder
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center flex-grow-1 text-secondary">
                  Bir sohbet seçin.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT MESSAGES TABLE */}
      {activeTab === "contactForms" && (
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <div className="d-flex flex-column flex-md-row gap-3 mb-4">
            <div className="flex-grow-1">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="İsim, e-posta veya konu ara..."
              />
            </div>
            <div style={{ minWidth: "200px" }}>
              <FilterSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "Tüm Mesajlar" },
                  { value: "unread", label: "Okunmamış" },
                  { value: "read", label: "Okunmuş" },
                  { value: "replied", label: "Cevaplananlar" },
                ]}
              />
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : (
            <MessageTable
              messages={filteredMessages}
              onViewDetail={handleViewDetail}
              onToggleRead={handleToggleRead}
              onDelete={handleDelete}
            />
          )}

          {selectedMessage && (
            <MessageDetailModal
              message={selectedMessage}
              onClose={() => setSelectedMessage(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

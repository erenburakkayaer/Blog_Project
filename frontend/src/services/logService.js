import { apiRequest, USE_MOCK_DATA } from "./api";

/**
 * TechNova — Audit Log Service
 * Mehdi'nin Branch'i (DTO/Log/) ile %100 senkronize
 * 
 * Model:
 * - id: long
 * - userId: int?
 * - userFullName: string?
 * - entityName: string
 * - entityId: string
 * - action: AuditAction (Create=0, Update=1, Delete=2, Login=3, Logout=4, StatusChange=5)
 * - ipAddress: string
 * - httpMethod: string?
 * - statusCode: int?
 * - createdAt: DateTime
 */

let mockLogs = [
  {
    id: 101,
    userId: 1,
    userFullName: "Samet Başkale",
    entityName: "Blog",
    entityId: "1",
    action: 0, // Create
    actionText: "Oluşturma",
    ipAddress: "192.168.1.1",
    httpMethod: "POST",
    statusCode: 201,
    createdAt: "2026-08-18T10:30:00Z",
  },
  {
    id: 102,
    userId: 1,
    userFullName: "Samet Başkale",
    entityName: "Project",
    entityId: "3",
    action: 1, // Update
    actionText: "Güncelleme",
    ipAddress: "192.168.1.1",
    httpMethod: "PUT",
    statusCode: 200,
    createdAt: "2026-08-18T11:15:00Z",
  },
  {
    id: 103,
    userId: 1,
    userFullName: "Samet Başkale",
    entityName: "User",
    entityId: "2",
    action: 5, // StatusChange (Rol/Yetki değişimi)
    actionText: "Rol Değişimi",
    ipAddress: "192.168.1.1",
    httpMethod: "PATCH",
    statusCode: 200,
    createdAt: "2026-08-18T14:45:00Z",
  },
];

export const logService = {
  /**
   * Sistem Denetim ve Güvenlik Loglarını Listeler (Admin)
   * Backend: GET /api/logs?page=1&pageSize=50
   */
  getAll: async (page = 1, pageSize = 50) => {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 150));
      return { items: mockLogs, totalCount: mockLogs.length, page, pageSize };
    }
    return await apiRequest(`/logs?page=${page}&pageSize=${pageSize}`);
  },

  /**
   * Log Detayını Getirir
   * Backend: GET /api/logs/{id}
   */
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      const found = mockLogs.find((l) => l.id === Number(id));
      if (!found) throw new Error("Log kaydı bulunamadı.");
      return found;
    }
    return await apiRequest(`/logs/${id}`);
  },
};

export default logService;

using Staj_proje.DTO.Log;
using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface ILogService
    {
        // Create
        Task LogActionAsync(int? userId, string entityName, string entityId, AuditAction action, 
            string? oldValues, string? newValues, string ipAddress, string userAgent, 
            string? httpMethod = null, int? statusCode = null);
        
        // Read
        Task<LogDetailDto> GetLogByIdAsync(long id);
        Task<List<LogListDto>> GetAllLogsAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<LogListDto>> GetLogsByUserAsync(int userId, int pageNumber = 1, int pageSize = 20);
        Task<List<LogListDto>> GetLogsByEntityAsync(string entityName, int pageNumber = 1, int pageSize = 20);
        Task<List<LogListDto>> GetLogsByEntityIdAsync(string entityId, int pageNumber = 1, int pageSize = 20);
        Task<List<LogListDto>> GetLogsByActionAsync(AuditAction action, int pageNumber = 1, int pageSize = 20);
        Task<List<LogListDto>> GetLogsByDateRangeAsync(DateTime startDate, DateTime endDate, 
            int pageNumber = 1, int pageSize = 20);
        
        // Filter & Search
        Task<List<LogListDto>> FilterLogsAsync(LogFilterDto filterDto);
        Task<List<LogListDto>> SearchLogsByIpAddressAsync(string ipAddress, int pageNumber = 1, int pageSize = 20);
        Task<List<LogListDto>> GetLoginLogsAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<LogListDto>> GetLogoutLogsAsync(int pageNumber = 1, int pageSize = 20);
        
        // Statistics
        Task<int> GetTotalLogCountAsync();
        Task<int> GetLogCountByUserAsync(int userId);
        Task<int> GetLogCountByEntityAsync(string entityName);
        Task<int> GetLogCountByActionAsync(AuditAction action);
        Task<int> GetLogCountByDateRangeAsync(DateTime startDate, DateTime endDate);
        
        // Delete (Admin Operasyonları)
        Task<bool> DeleteLogAsync(long id);
        Task<bool> DeleteLogsByUserAsync(int userId);
        Task<bool> DeleteLogsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<bool> DeleteAllLogsAsync();
        
        // Export
        Task<byte[]> ExportLogsAsync(LogFilterDto filterDto);
    }
}
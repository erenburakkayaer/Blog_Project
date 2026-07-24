using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    // Sadece okuma — loglar sistem tarafından (ör. servislerden) yazılır, API üzerinden değil
    public interface ILogService
    {
        Task<IEnumerable<LogDto>> GetAllAsync();
        Task<LogDto?> GetByIdAsync(int id);
    }
}

using Staj_proje.DTO.Application;
using Staj_proje.Entities;

namespace Staj_proje.Services
{
    public interface IApplicationService
    {
        Task<ApplicationResponseDto> CreateAsync(ApplicationCreateDto dto, int? userId);
        Task<ApplicationResponseDto?> GetByIdAsync(int id);
        Task<List<ApplicationResponseDto>> GetPendingApplicationsAsync();
        Task<List<ApplicationResponseDto>> GetByCareerIdAsync(int careerId);
        Task<List<ApplicationResponseDto>> GetByUserIdAsync(int userId);
        Task UpdateAsync(int id, ApplicationUpdateDto dto, int? userId);
        Task ChangeStatusAsync(int id, ApplicationStatus newStatus, int reviewerId, string? adminNotes = null);
        Task DeleteAsync(int id);
        Task RestoreAsync(int id);
    }
}
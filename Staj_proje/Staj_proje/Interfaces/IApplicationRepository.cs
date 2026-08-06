using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface IApplicationRepository : IGenericRepository<Application>
    {
        // Tüm detayları (İlan, Başvuran Kullanıcı, İnceleyen İK) ile tek bir başvuruyu getirir
        Task<Application?> GetApplicationWithDetailsByIdAsync(int id);

        // Beklemede/İncelenmede olan başvuruları İlan ve Kullanıcı detaylarıyla getirir
        Task<List<Application>> GetPendingApplicationsWithDetailsAsync();

        // Belirli bir iş ilanına (Career) yapılmış olan silinmemiş tüm başvuruları getirir
        Task<List<Application>> GetApplicationsByCareerIdAsync(int careerId);

        // Belirli bir adayın (User) geçmiş başvurularını getirir
        Task<List<Application>> GetApplicationsByUserIdAsync(int userId);

        // Başvuru durumuna göre filtreleme (Örn: Shortlisted, Rejected, Hired)
        Task<List<Application>> GetApplicationsByStatusAsync(ApplicationStatus status);
    }
}
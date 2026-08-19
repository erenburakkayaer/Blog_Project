using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface ICareerRepository : IGenericRepository<Career>
    {
        // Tüm silinmemiş ilanları Company ve Category detaylarıyla getirir
        Task<List<Career>> GetAllCareersWithDetailsAsync();

        // Tüm detayları (Company, Category) içeren aktif ve tarihi geçmemiş ilanları getirir
        Task<List<Career>> GetActiveCareersWithDetailsAsync();

        // Id'ye göre ilanı tüm detaylarıyla getirir
        Task<Career?> GetCareerWithDetailsByIdAsync(int id);

        // Belirli bir şirkete ait ilanları getirir
        Task<List<Career>> GetCareersByCompanyIdAsync(int companyId);

        // Belirli bir kategoriye ait ilanları getirir
        Task<List<Career>> GetCareersByCategoryIdAsync(int categoryId);

        // Çalışma türüne (FullTime, Internship vb.) göre ilanları filtreler
        Task<List<Career>> GetCareersByEmploymentTypeAsync(EmploymentType employmentType);

        // Süresi dolmuş ilanları Company ve Category detaylarıyla getirir
        Task<List<Career>> GetExpiredCareersWithDetailsAsync();
    }
}
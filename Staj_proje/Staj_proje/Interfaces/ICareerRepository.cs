using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface ICareerRepository : IGenericRepository<Career>
    {
        // Tüm detayları (Company, Category) içeren aktif ve tarihi geçmemiş ilanları getirir
        Task<List<Career>> GetActiveCareersWithDetailsAsync();

        // Id'ye göre ilanı tüm detaylarıyla getirir
        Task<Career?> GetCareerWithDetailsByIdAsync(int id);

        // Belirli bir şirkete ait ilanları getirir
        Task<List<Career>> GetCareersByCompanyIdAsync(int companyId);

        // Çalışma türüne (FullTime, Internship vb.) göre ilanları filtreler
        Task<List<Career>> GetCareersByEmploymentTypeAsync(EmploymentType employmentType);
    }
}
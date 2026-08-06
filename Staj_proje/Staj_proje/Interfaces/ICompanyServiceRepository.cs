using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface ICompanyServiceRepository : IGenericRepository<CompanyService>
    {
        // Öne çıkan aktif hizmetleri kategorisi ve şirketiyle birlikte getirir
        Task<List<CompanyService>> GetFeaturedServicesWithDetailsAsync();

        // Id'ye göre hizmet detayını Şirket ve Kategori verisiyle getirir
        Task<CompanyService?> GetServiceWithDetailsByIdAsync(int id);

        // Belirli bir kategoriye ait aktif hizmetleri getirir
        Task<List<CompanyService>> GetServicesByCategoryIdAsync(int categoryId);

        // Belirli bir şirkete ait tüm aktif hizmetleri getirir
        Task<List<CompanyService>> GetServicesByCompanyIdAsync(int companyId);
    }
}
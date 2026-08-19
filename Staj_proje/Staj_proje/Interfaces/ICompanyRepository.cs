using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface ICompanyRepository : IGenericRepository<Company>
    {
        Task<Company?> GetCompanyWithDetailsByIdAsync(int id);
        Task<List<Company>> GetAllCompaniesWithDetailsAsync();
        Task<List<Company>> GetActiveCompaniesWithLogosAsync();
        Task<List<Company>> GetCompaniesWithActiveCareerAsync();
    }
}

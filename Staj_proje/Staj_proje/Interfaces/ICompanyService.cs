using Staj_proje.DTO.Company;

namespace Staj_proje.Services.Interfaces
{
    public interface ICompanyService
    {
        // Create
        Task<int> CreateCompanyAsync(CompanyCreateDto createCompanyDto);
        
        // Read
        Task<CompanyDetailDto> GetCompanyByIdAsync(int id);
        Task<List<CompanyListDto>> GetAllCompaniesAsync();
        Task<List<CompanyListDto>> GetCompaniesWithActiveCareerAsync();
        
        // Update
        Task<bool> UpdateCompanyAsync(int id, CompanyUpdateDto updateCompanyDto);
        Task<bool> UpdateCompanyLogoAsync(int id, int logoFileAssetId);
        
        // Delete
        Task<bool> DeleteCompanyAsync(int id);
        Task<bool> RestoreCompanyAsync(int id);
        Task<bool> PermanentlyDeleteCompanyAsync(int id);
        
        // Search & Filter
        Task<List<CompanyListDto>> SearchCompaniesAsync(string keyword);
        Task<List<CompanyListDto>> GetCompaniesByLocationAsync(string location);
        
        // Validation & Check
        Task<bool> IsCompanyExistsAsync(int id);
        Task<bool> IsCompanyNameExistsAsync(string name);
        Task<bool> IsCompanyEmailExistsAsync(string email);
    }
}
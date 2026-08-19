using Staj_proje.DTO.CompanyService;

namespace Staj_proje.Interfaces
{
    public interface ICompanyServiceService
    {
        // Create
        Task<int> CreateServiceAsync(CompanyServiceCreateDto createServiceDto);
        
        // Read
        Task<CompanyServiceDetailDto> GetServiceByIdAsync(int id);
        Task<List<CompanyServiceListDto>> GetAllServicesAsync();
        Task<List<CompanyServiceListDto>> GetActiveServicesAsync();
        Task<List<CompanyServiceListDto>> GetFeaturedServicesAsync();
        Task<List<CompanyServiceListDto>> GetServicesByCompanyAsync(int companyId);
        Task<List<CompanyServiceListDto>> GetServicesByCategoryAsync(int categoryId);
        Task<List<CompanyServiceListDto>> GetActiveServicesByCompanyAsync(int companyId);
        
        // Update
        Task<bool> UpdateServiceAsync(int id, CompanyServiceUpdateDto updateServiceDto);
        Task<bool> ActivateServiceAsync(int id);
        Task<bool> DeactivateServiceAsync(int id);
        Task<bool> FeatureServiceAsync(int id);
        Task<bool> UnfeatureServiceAsync(int id);
        
        // Delete
        Task<bool> DeleteServiceAsync(int id);
        Task<bool> RestoreServiceAsync(int id);
        Task<bool> PermanentlyDeleteServiceAsync(int id);
        
        // Search & Filter
        Task<List<CompanyServiceListDto>> SearchServicesAsync(string keyword);
        
        // Validation & Check
        Task<bool> IsServiceExistsAsync(int id);
        Task<bool> IsServiceActiveAsync(int id);
        Task<bool> IsCompanyExistsAsync(int companyId);
    }
}
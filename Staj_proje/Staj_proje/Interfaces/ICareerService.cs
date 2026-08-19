using Staj_proje.DTO.Career;
using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface ICareerService
    {
        // Create
        Task<int> CreateCareerAsync(CareerCreateDto createCareerDto);
        
        // Read
        Task<CareerDetailDto> GetCareerByIdAsync(int id);
        Task<List<CareerListDto>> GetAllCareersAsync();
        Task<List<CareerListDto>> GetActiveCareersAsync();
        Task<List<CareerListDto>> GetCareersByCompanyAsync(int companyId);
        Task<List<CareerListDto>> GetCareersByEmploymentTypeAsync(EmploymentType employmentType);
        Task<List<CareerListDto>> GetCareersByCategoryAsync(int categoryId);
        
        // Update
        Task<bool> UpdateCareerAsync(int id, CareerUpdateDto updateCareerDto);
        Task<bool> UpdateCareerStatusAsync(int id, CareerStatusUpdateDto statusUpdateDto);
        Task<bool> ActivateCareerAsync(int id);
        Task<bool> DeactivateCareerAsync(int id);
        
        // Delete
        Task<bool> DeleteCareerAsync(int id);
        Task<bool> RestoreCareerAsync(int id);
        Task<bool> PermanentlyDeleteCareerAsync(int id);
        
        // Search & Filter
        Task<List<CareerListDto>> SearchCareersAsync(string keyword);
        Task<List<CareerListDto>> GetCareersByLocationAsync(string location);
        Task<List<CareerListDto>> GetExpiredCareersAsync();
        
        // Validation & Check
        Task<bool> IsCareerExistsAsync(int id);
        Task<bool> IsCareerExpiredAsync(int id);
        Task<bool> IsCareerActiveAsync(int id);
    }
}
using Staj_proje.DTO.Reference;
using Staj_proje.Entities;

namespace Staj_proje.Services.Interfaces
{
    public interface IReferenceService
    {
        // Create
        Task<int> CreateReferenceAsync(ReferenceCreateDto createReferenceDto);
        Task<List<int>> CreateMultipleReferencesAsync(List<ReferenceCreateDto> createReferenceDtos);
        
        // Read
        Task<ReferenceResponseDto> GetReferenceByIdAsync(int id);
        Task<List<ReferenceResponseDto>> GetAllReferencesAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<ReferenceResponseDto>> GetActiveReferencesAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<ReferenceResponseDto>> GetHomePageReferencesAsync();
        Task<List<ReferenceResponseDto>> GetReferencesByTypeAsync(ReferenceType type, int pageNumber = 1, int pageSize = 20);
        Task<List<ReferenceResponseDto>> GetClientReferencesAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<ReferenceResponseDto>> GetPartnerReferencesAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<ReferenceResponseDto>> GetSponsorReferencesAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<ReferenceResponseDto>> GetReferencesBySectorAsync(string sector, int pageNumber = 1, int pageSize = 20);
        
        // Update
        Task<bool> UpdateReferenceAsync(int id, ReferenceUpdateDto updateReferenceDto);
        Task<bool> ActivateReferenceAsync(int id);
        Task<bool> DeactivateReferenceAsync(int id);
        Task<bool> ShowOnHomeAsync(int id);
        Task<bool> HideFromHomeAsync(int id);
        Task<bool> UpdateDisplayOrderAsync(int id, int displayOrder);
        Task<bool> UpdateLogoAsync(int id, int fileAssetId);
        
        // Delete
        Task<bool> DeleteReferenceAsync(int id);
        Task<bool> RestoreReferenceAsync(int id);
        Task<bool> PermanentlyDeleteReferenceAsync(int id);
        
        // Reordering
        Task<bool> ReorderReferencesAsync(List<int> referenceIds);
        
        // Search & Filter
        Task<List<ReferenceResponseDto>> SearchReferencesByNameAsync(string name, int pageNumber = 1, int pageSize = 20);
        Task<List<ReferenceResponseDto>> SearchReferencesBySectorAsync(string sector, int pageNumber = 1, int pageSize = 20);
        
        // Statistics
        Task<int> GetTotalReferenceCountAsync();
        Task<int> GetActiveReferenceCountAsync();
        Task<int> GetHomePageReferenceCountAsync();
        Task<int> GetReferenceCountByTypeAsync(ReferenceType type);
        Task<int> GetReferenceCountBySectorAsync(string sector);
        
        // Validation & Check
        Task<bool> IsReferenceExistsAsync(int id);
        Task<bool> IsReferenceNameExistsAsync(string name, int? excludeReferenceId = null);
        Task<bool> IsFileAssetExistsAsync(int fileAssetId);
    }
}
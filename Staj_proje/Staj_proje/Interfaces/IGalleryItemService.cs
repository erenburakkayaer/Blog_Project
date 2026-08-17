using Staj_proje.DTO.GalleyItem;

namespace Staj_proje.Services.Interfaces
{
    public interface IGalleryItemService
    {
        // Create
        Task<int> CreateGalleryItemAsync(GalleryItemCreateDto createGalleryItemDto);
        Task<List<int>> CreateMultipleGalleryItemsAsync(List<GalleryItemCreateDto> createGalleryItemDtos);
        
        // Read
        Task<GalleryItemResponseDto> GetGalleryItemByIdAsync(int id);
        Task<List<GalleryItemResponseDto>> GetAllGalleryItemsAsync();
        Task<List<GalleryItemResponseDto>> GetGalleryItemsByCompanyAsync(int companyId);
        Task<List<GalleryItemResponseDto>> GetActiveGalleryItemsByCompanyAsync(int companyId);
        Task<List<GalleryItemResponseDto>> GetFeaturedGalleryItemsByCompanyAsync(int companyId);
        Task<List<GalleryItemResponseDto>> GetGalleryItemsByCompanyOrderedAsync(int companyId);
        
        // Update
        Task<bool> UpdateGalleryItemAsync(int id, GalleryItemUpdateDto updateGalleryItemDto);
        Task<bool> ActivateGalleryItemAsync(int id);
        Task<bool> DeactivateGalleryItemAsync(int id);
        Task<bool> FeatureGalleryItemAsync(int id);
        Task<bool> UnfeatureGalleryItemAsync(int id);
        Task<bool> UpdateDisplayOrderAsync(int id, int displayOrder);
        
        // Delete
        Task<bool> DeleteGalleryItemAsync(int id);
        Task<bool> RestoreGalleryItemAsync(int id);
        Task<bool> PermanentlyDeleteGalleryItemAsync(int id);
        Task<bool> DeleteGalleryItemsByCompanyAsync(int companyId);
        
        // Validation & Check
        Task<bool> IsGalleryItemExistsAsync(int id);
        Task<bool> IsCompanyExistsAsync(int companyId);
        Task<bool> IsFileAssetExistsAsync(int fileAssetId);
    }
}
using Staj_proje.DTO.Slider;

namespace Staj_proje.Interfaces
{
    public interface ISliderService
    {
        // Create
        Task<int> CreateSliderAsync(SliderCreateDto createSliderDto);
        Task<List<int>> CreateMultipleSlidersAsync(List<SliderCreateDto> createSliderDtos);
        
        // Read
        Task<SliderResponseDto> GetSliderByIdAsync(int id);
        Task<List<SliderResponseDto>> GetAllSlidersAsync();
        Task<List<SliderResponseDto>> GetActiveSlidersAsync();
        Task<List<SliderResponseDto>> GetActiveSlidersOrderedAsync();
        
        // Update
        Task<bool> UpdateSliderAsync(int id, SliderUpdateDto updateSliderDto);
        Task<bool> ActivateSliderAsync(int id);
        Task<bool> DeactivateSliderAsync(int id);
        Task<bool> UpdateDisplayOrderAsync(int id, int displayOrder);
        Task<bool> UpdateImageAsync(int id, int fileAssetId);
        Task<bool> UpdateButtonAsync(int id, string buttonText, string buttonUrl, bool openInNewTab);
        Task<bool> UpdateTitleAsync(int id, string title);
        Task<bool> UpdateSubtitleAsync(int id, string subtitle);
        
        // Delete
        Task<bool> DeleteSliderAsync(int id);
        Task<bool> RestoreSliderAsync(int id);
        Task<bool> PermanentlyDeleteSliderAsync(int id);
        
        // Reordering
        Task<bool> ReorderSlidersAsync(List<int> sliderIds);
        Task<bool> MoveSliderUpAsync(int id);
        Task<bool> MoveSliderDownAsync(int id);
        
        // Search & Filter
        Task<List<SliderResponseDto>> SearchSlidersByTitleAsync(string title);
        
        // Statistics
        Task<int> GetTotalSliderCountAsync();
        Task<int> GetActiveSliderCountAsync();
        
        // Validation & Check
        Task<bool> IsSliderExistsAsync(int id);
        Task<bool> IsFileAssetExistsAsync(int fileAssetId);
    }
}
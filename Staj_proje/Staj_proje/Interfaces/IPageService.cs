using Staj_proje.DTO.Page;
using Staj_proje.Entities;

namespace Staj_proje.Services.Interfaces
{
    public interface IPageService
    {
        // Create
        Task<int> CreatePageAsync(PageCreateDto createPageDto);
        
        // Read
        Task<PageDetailDto> GetPageByIdAsync(int id);
        Task<PageDetailDto> GetPageBySlugAsync(string slug);
        Task<List<PageListDto>> GetAllPagesAsync();
        Task<List<PageListDto>> GetActivePagesAsync();
        Task<List<PageListDto>> GetPagesByTypeAsync(PageType type);
        Task<List<PageListDto>> GetHeaderPagesAsync();
        Task<List<PageListDto>> GetFooterPagesAsync();
        Task<List<PageListDto>> GetServicePagesAsync();
        
        // Update
        Task<bool> UpdatePageAsync(int id, PageUpdateDto updatePageDto);
        Task<bool> ActivatePageAsync(int id);
        Task<bool> DeactivatePageAsync(int id);
        Task<bool> UpdateDisplayOrderAsync(int id, int displayOrder);
        Task<bool> ToggleHeaderVisibilityAsync(int id);
        Task<bool> ToggleFooterVisibilityAsync(int id);
        
        // Delete
        Task<bool> DeletePageAsync(int id);
        Task<bool> RestorePageAsync(int id);
        Task<bool> PermanentlyDeletePageAsync(int id);
        
        // Search & Filter
        Task<List<PageListDto>> SearchPagesByTitleAsync(string title);
        Task<List<PageListDto>> SearchPagesBySlugAsync(string slug);
        Task<List<PageListDto>> GetPagesByDateRangeAsync(DateTime startDate, DateTime endDate);
        
        // Validation & Check
        Task<bool> IsPageExistsAsync(int id);
        Task<bool> IsPageExistsBySlugAsync(string slug);
        Task<bool> IsSlugUniqueAsync(string slug, int? excludePageId = null);
        
        // SEO
        Task<bool> UpdatePageSeoAsync(int pageId, int seoSettingId);
        Task<bool> RemovePageSeoAsync(int pageId);
    }
}
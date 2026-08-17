using Staj_proje.DTO.SeoSetting;

namespace Staj_proje.Services.Interfaces
{
    public interface ISeoSettingService
    {
        // Create
        Task<int> CreateSeoSettingAsync(SeoSettingCreateDto createSeoSettingDto);
        
        // Read
        Task<SeoSettingResponseDto> GetSeoSettingByIdAsync(int id);
        Task<SeoSettingResponseDto> GetGlobalSeoSettingAsync();
        Task<SeoSettingResponseDto> GetSeoSettingByPageAsync(int pageId);
        
        // Update
        Task<bool> UpdateSeoSettingAsync(int id, SeoSettingUpdateDto updateSeoSettingDto);
        Task<bool> UpdateMetaTitleAsync(int id, string metaTitle);
        Task<bool> UpdateMetaDescriptionAsync(int id, string metaDescription);
        Task<bool> UpdateMetaKeywordsAsync(int id, string metaKeywords);
        Task<bool> UpdateAuthorAsync(int id, string author);
        Task<bool> UpdateOgImageAsync(int id, int fileAssetId);
        Task<bool> UpdateGoogleAnalyticsIdAsync(int id, string analyticsId);
        Task<bool> UpdateGoogleSearchConsoleCodeAsync(int id, string searchConsoleCode);
        Task<bool> UpdateRobotsTxtContentAsync(int id, string robotsTxtContent);
        Task<bool> UpdateIndexSiteAsync(int id, bool indexSite);
        
        // Delete
        Task<bool> DeleteSeoSettingAsync(int id);
        
        // SEO Validation
        Task<bool> ValidateMetaTitleLengthAsync(string metaTitle);
        Task<bool> ValidateMetaDescriptionLengthAsync(string metaDescription);
        Task<bool> ValidateOgTitleLengthAsync(string ogTitle);
        Task<bool> ValidateOgDescriptionLengthAsync(string ogDescription);
        
        // Robots & Indexing
        Task<string> GenerateRobotsTxtAsync();
        Task<string> GetRobotsTxtContentAsync();
        Task<bool> IsIndexingEnabledAsync();
        Task<bool> ToggleIndexingAsync(int id);
        
        // Open Graph / Social Media
        Task<bool> UpdateOpenGraphSettingsAsync(int id, string ogTitle, string ogDescription, int? ogImageAssetId);
        
        // Analytics & Search Console
        Task<bool> HasGoogleAnalyticsAsync();
        Task<bool> HasGoogleSearchConsoleAsync();
        Task<string> GetGoogleAnalyticsIdAsync();
        Task<string> GetGoogleSearchConsoleCodeAsync();
        
        // Validation & Check
        Task<bool> IsSeoSettingExistsAsync(int id);
        Task<bool> IsFileAssetExistsAsync(int fileAssetId);
    }
}
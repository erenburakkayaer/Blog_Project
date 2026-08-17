using Staj_proje.DTO.Setting;

namespace Staj_proje.Services.Interfaces
{
    public interface ISettingService
    {
        // Create
        Task<int> CreateSettingAsync(SettingUpdateDto settingDto);
        
        // Read
        Task<SettingResponseDto> GetSettingByIdAsync(int id);
        Task<SettingResponseDto> GetGlobalSettingAsync();
        
        // Update - Site Bilgileri
        Task<bool> UpdateSiteNameAsync(string siteName);
        Task<bool> UpdateSiteTitleAsync(string siteTitle);
        Task<bool> UpdateSiteDescriptionAsync(string siteDescription);
        
        // Update - Logolar
        Task<bool> UpdateLogoAsync(int fileAssetId);
        Task<bool> UpdateHeaderLogoAsync(int fileAssetId);
        Task<bool> UpdateFooterLogoAsync(int fileAssetId);
        Task<bool> UpdateFaviconAsync(int fileAssetId);
        
        // Update - İletişim Bilgileri
        Task<bool> UpdateEmailAsync(string email);
        Task<bool> UpdatePhoneAsync(string phone);
        Task<bool> UpdateWhatsAppPhoneAsync(string whatsAppPhone);
        Task<bool> UpdateAddressAsync(string address);
        Task<bool> UpdateGoogleMapsEmbedUrlAsync(string mapsUrl);
        
        // Update - Sosyal Medya
        Task<bool> UpdateLinkedinUrlAsync(string linkedinUrl);
        Task<bool> UpdateGithubUrlAsync(string githubUrl);
        Task<bool> UpdateTwitterUrlAsync(string twitterUrl);
        Task<bool> UpdateInstagramUrlAsync(string instagramUrl);
        
        // Update - Sistem Ayarları
        Task<bool> UpdateMaintenanceModeAsync(bool isMaintenanceMode);
        Task<bool> EnableMaintenanceModeAsync();
        Task<bool> DisableMaintenanceModeAsync();
        
        // Toplu Update
        Task<bool> UpdateSettingAsync(int id, SettingUpdateDto settingDto);
        Task<bool> UpdateAllContactInfoAsync(string email, string phone, string address);
        Task<bool> UpdateAllSocialMediaAsync(string linkedinUrl, string githubUrl, string twitterUrl, string instagramUrl);
        
        // Read - İletişim Bilgileri
        Task<string> GetEmailAsync();
        Task<string> GetPhoneAsync();
        Task<string> GetWhatsAppPhoneAsync();
        Task<string> GetAddressAsync();
        Task<string> GetGoogleMapsEmbedUrlAsync();
        
        // Read - Sosyal Medya
        Task<string> GetLinkedinUrlAsync();
        Task<string> GetGithubUrlAsync();
        Task<string> GetTwitterUrlAsync();
        Task<string> GetInstagramUrlAsync();
        
        // Read - Logolar (URL'ler)
        Task<string> GetLogoUrlAsync();
        Task<string> GetHeaderLogoUrlAsync();
        Task<string> GetFooterLogoUrlAsync();
        Task<string> GetFaviconUrlAsync();
        
        // Read - Site Bilgileri
        Task<string> GetSiteNameAsync();
        Task<string> GetSiteTitleAsync();
        Task<string> GetSiteDescriptionAsync();
        
        // Sistem Durumu
        Task<bool> IsMaintenanceModeAsync();
        
        // Validation & Check
        Task<bool> IsSettingExistsAsync(int id);
        Task<bool> IsFileAssetExistsAsync(int fileAssetId);
        Task<bool> HasValidContactInfoAsync();
        Task<bool> HasValidSocialMediaAsync();
    }
}
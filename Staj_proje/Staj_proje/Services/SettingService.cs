using Mapster;
using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.DTO.Setting;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    public class SettingService : ISettingService
    {
        private readonly AppDbContext _context;

        public SettingService(AppDbContext context)
        {
            _context = context;
        }

        #region Helpers

        private IQueryable<Setting> GetSettingWithIncludes()
        {
            return _context.Set<Setting>()
                .Include(s => s.LogoFileAsset)
                .Include(s => s.HeaderLogoFileAsset)
                .Include(s => s.FooterLogoFileAsset)
                .Include(s => s.FaviconFileAsset);
        }

        private async Task<Setting?> GetGlobalSettingEntityAsync()
        {
            return await _context.Set<Setting>().FirstOrDefaultAsync();
        }

        #endregion

        #region Create

        public async Task<int> CreateSettingAsync(SettingUpdateDto settingDto)
        {
            var setting = settingDto.Adapt<Setting>();
            setting.UpdatedAt = DateTime.UtcNow;

            await _context.Set<Setting>().AddAsync(setting);
            await _context.SaveChangesAsync();

            return setting.Id;
        }

        #endregion

        #region Read

        public async Task<SettingResponseDto> GetSettingByIdAsync(int id)
        {
            var setting = await GetSettingWithIncludes()
                .FirstOrDefaultAsync(s => s.Id == id);

            if (setting == null)
            {
                throw new KeyNotFoundException($"ID değeri {id} olan ayar bulunamadı.");
            }

            return setting.Adapt<SettingResponseDto>();
        }

        public async Task<SettingResponseDto> GetGlobalSettingAsync()
        {
            var setting = await GetSettingWithIncludes()
                .FirstOrDefaultAsync();

            if (setting == null)
            {
                throw new KeyNotFoundException("Genel sistem ayarları henüz oluşturulmamış.");
            }

            return setting.Adapt<SettingResponseDto>();
        }

        #endregion

        #region Update - Site Bilgileri

        public async Task<bool> UpdateSiteNameAsync(string siteName)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.SiteName = siteName;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateSiteTitleAsync(string siteTitle)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.SiteTitle = siteTitle;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateSiteDescriptionAsync(string siteDescription)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.SiteDescription = siteDescription;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region Update - Logolar

        public async Task<bool> UpdateLogoAsync(int fileAssetId)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            var assetExists = await IsFileAssetExistsAsync(fileAssetId);
            if (!assetExists) return false;

            setting.LogoFileAssetId = fileAssetId;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateHeaderLogoAsync(int fileAssetId)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            var assetExists = await IsFileAssetExistsAsync(fileAssetId);
            if (!assetExists) return false;

            setting.HeaderLogoFileAssetId = fileAssetId;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateFooterLogoAsync(int fileAssetId)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            var assetExists = await IsFileAssetExistsAsync(fileAssetId);
            if (!assetExists) return false;

            setting.FooterLogoFileAssetId = fileAssetId;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateFaviconAsync(int fileAssetId)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            var assetExists = await IsFileAssetExistsAsync(fileAssetId);
            if (!assetExists) return false;

            setting.FaviconFileAssetId = fileAssetId;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region Update - İletişim Bilgileri

        public async Task<bool> UpdateEmailAsync(string email)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.Email = email;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdatePhoneAsync(string phone)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.Phone = phone;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateWhatsAppPhoneAsync(string whatsAppPhone)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.WhatsAppPhone = whatsAppPhone;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAddressAsync(string address)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.Address = address;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateGoogleMapsEmbedUrlAsync(string mapsUrl)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.GoogleMapsEmbedUrl = mapsUrl;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region Update - Sosyal Medya

        public async Task<bool> UpdateLinkedinUrlAsync(string linkedinUrl)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.LinkedinUrl = linkedinUrl;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateGithubUrlAsync(string githubUrl)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.GithubUrl = githubUrl;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateTwitterUrlAsync(string twitterUrl)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.TwitterUrl = twitterUrl;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateInstagramUrlAsync(string instagramUrl)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.InstagramUrl = instagramUrl;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region Update - Sistem Ayarları

        public async Task<bool> UpdateMaintenanceModeAsync(bool isMaintenanceMode)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.IsMaintenanceMode = isMaintenanceMode;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> EnableMaintenanceModeAsync()
        {
            return await UpdateMaintenanceModeAsync(true);
        }

        public async Task<bool> DisableMaintenanceModeAsync()
        {
            return await UpdateMaintenanceModeAsync(false);
        }

        #endregion

        #region Toplu Update

        public async Task<bool> UpdateSettingAsync(int id, SettingUpdateDto settingDto)
        {
            var setting = await _context.Set<Setting>().FindAsync(id);
            if (setting == null) return false;

            settingDto.Adapt(setting);
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAllContactInfoAsync(string email, string phone, string address)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.Email = email;
            setting.Phone = phone;
            setting.Address = address;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAllSocialMediaAsync(string linkedinUrl, string githubUrl, string twitterUrl, string instagramUrl)
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            setting.LinkedinUrl = linkedinUrl;
            setting.GithubUrl = githubUrl;
            setting.TwitterUrl = twitterUrl;
            setting.InstagramUrl = instagramUrl;
            setting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region Read - İletişim Bilgileri

        public async Task<string> GetEmailAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.Email ?? string.Empty;
        }

        public async Task<string> GetPhoneAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.Phone ?? string.Empty;
        }

        public async Task<string> GetWhatsAppPhoneAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.WhatsAppPhone ?? string.Empty;
        }

        public async Task<string> GetAddressAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.Address ?? string.Empty;
        }

        public async Task<string> GetGoogleMapsEmbedUrlAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.GoogleMapsEmbedUrl ?? string.Empty;
        }

        #endregion

        #region Read - Sosyal Medya

        public async Task<string> GetLinkedinUrlAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.LinkedinUrl ?? string.Empty;
        }

        public async Task<string> GetGithubUrlAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.GithubUrl ?? string.Empty;
        }

        public async Task<string> GetTwitterUrlAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.TwitterUrl ?? string.Empty;
        }

        public async Task<string> GetInstagramUrlAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.InstagramUrl ?? string.Empty;
        }

        #endregion

        #region Read - Logolar (URL'ler)

        public async Task<string> GetLogoUrlAsync()
        {
            var setting = await GetSettingWithIncludes().FirstOrDefaultAsync();
            return setting?.LogoFileAsset?.FilePath ?? string.Empty;
        }

        public async Task<string> GetHeaderLogoUrlAsync()
        {
            var setting = await GetSettingWithIncludes().FirstOrDefaultAsync();
            return setting?.HeaderLogoFileAsset?.FilePath ?? string.Empty;
        }

        public async Task<string> GetFooterLogoUrlAsync()
        {
            var setting = await GetSettingWithIncludes().FirstOrDefaultAsync();
            return setting?.FooterLogoFileAsset?.FilePath ?? string.Empty;
        }

        public async Task<string> GetFaviconUrlAsync()
        {
            var setting = await GetSettingWithIncludes().FirstOrDefaultAsync();
            return setting?.FaviconFileAsset?.FilePath ?? string.Empty;
        }

        #endregion

        #region Read - Site Bilgileri

        public async Task<string> GetSiteNameAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.SiteName ?? string.Empty;
        }

        public async Task<string> GetSiteTitleAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.SiteTitle ?? string.Empty;
        }

        public async Task<string> GetSiteDescriptionAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.SiteDescription ?? string.Empty;
        }

        #endregion

        #region Sistem Durumu

        public async Task<bool> IsMaintenanceModeAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            return setting?.IsMaintenanceMode ?? false;
        }

        #endregion

        #region Validation & Check

        public async Task<bool> IsSettingExistsAsync(int id)
        {
            return await _context.Set<Setting>().AnyAsync(s => s.Id == id);
        }

        public async Task<bool> IsFileAssetExistsAsync(int fileAssetId)
        {
            return await _context.Set<FileAsset>().AnyAsync(f => f.Id == fileAssetId);
        }

        public async Task<bool> HasValidContactInfoAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            return !string.IsNullOrWhiteSpace(setting.Email) ||
                   !string.IsNullOrWhiteSpace(setting.Phone) ||
                   !string.IsNullOrWhiteSpace(setting.Address);
        }

        public async Task<bool> HasValidSocialMediaAsync()
        {
            var setting = await GetGlobalSettingEntityAsync();
            if (setting == null) return false;

            return !string.IsNullOrWhiteSpace(setting.LinkedinUrl) ||
                   !string.IsNullOrWhiteSpace(setting.GithubUrl) ||
                   !string.IsNullOrWhiteSpace(setting.TwitterUrl) ||
                   !string.IsNullOrWhiteSpace(setting.InstagramUrl);
        }

        #endregion
    }
}
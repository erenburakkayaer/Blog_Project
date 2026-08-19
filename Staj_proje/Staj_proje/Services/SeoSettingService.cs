using Mapster;
using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.DTO.SeoSetting;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    public class SeoSettingService : ISeoSettingService
    {
        private readonly AppDbContext _context;

        public SeoSettingService(AppDbContext context)
        {
            _context = context;
        }

        #region Create

        public async Task<int> CreateSeoSettingAsync(SeoSettingCreateDto createSeoSettingDto)
        {
            if (createSeoSettingDto.OgImageAssetId.HasValue)
            {
                var assetExists = await IsFileAssetExistsAsync(createSeoSettingDto.OgImageAssetId.Value);
                if (!assetExists)
                {
                    throw new KeyNotFoundException($"ID değeri {createSeoSettingDto.OgImageAssetId.Value} olan görsel (FileAsset) bulunamadı.");
                }
            }

            var seoSetting = createSeoSettingDto.Adapt<SeoSetting>();
            seoSetting.UpdatedAt = DateTime.UtcNow;

            await _context.Set<SeoSetting>().AddAsync(seoSetting);
            await _context.SaveChangesAsync();

            return seoSetting.Id;
        }

        #endregion

        #region Read

        public async Task<SeoSettingResponseDto> GetSeoSettingByIdAsync(int id)
        {
            var seoSetting = await _context.Set<SeoSetting>()
                .Include(s => s.OgImageAsset)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (seoSetting == null)
            {
                throw new KeyNotFoundException($"ID değeri {id} olan SEO ayarı bulunamadı.");
            }

            return seoSetting.Adapt<SeoSettingResponseDto>();
        }

        public async Task<SeoSettingResponseDto> GetGlobalSeoSettingAsync()
        {
            var seoSetting = await _context.Set<SeoSetting>()
                .Include(s => s.OgImageAsset)
                .FirstOrDefaultAsync();

            if (seoSetting == null)
            {
                throw new KeyNotFoundException("Genel SEO ayarları henüz oluşturulmamış.");
            }

            return seoSetting.Adapt<SeoSettingResponseDto>();
        }

        public async Task<SeoSettingResponseDto> GetSeoSettingByPageAsync(int pageId)
        {
            return await GetSeoSettingByIdAsync(pageId);
        }

        #endregion

        #region Update

        public async Task<bool> UpdateSeoSettingAsync(int id, SeoSettingUpdateDto updateSeoSettingDto)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            if (updateSeoSettingDto.OgImageAssetId.HasValue)
            {
                var assetExists = await IsFileAssetExistsAsync(updateSeoSettingDto.OgImageAssetId.Value);
                if (!assetExists) return false;
            }

            updateSeoSettingDto.Adapt(seoSetting);
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateMetaTitleAsync(int id, string metaTitle)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            seoSetting.MetaTitle = metaTitle;
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateMetaDescriptionAsync(int id, string metaDescription)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            seoSetting.MetaDescription = metaDescription;
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateMetaKeywordsAsync(int id, string metaKeywords)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            seoSetting.MetaKeywords = metaKeywords;
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAuthorAsync(int id, string author)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            seoSetting.Author = author;
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateOgImageAsync(int id, int fileAssetId)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            var assetExists = await IsFileAssetExistsAsync(fileAssetId);
            if (!assetExists) return false;

            seoSetting.OgImageAssetId = fileAssetId;
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateGoogleAnalyticsIdAsync(int id, string analyticsId)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            seoSetting.GoogleAnalyticsId = analyticsId;
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateGoogleSearchConsoleCodeAsync(int id, string searchConsoleCode)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            seoSetting.GoogleSearchConsoleCode = searchConsoleCode;
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateRobotsTxtContentAsync(int id, string robotsTxtContent)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            seoSetting.RobotsTxtContent = robotsTxtContent;
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateIndexSiteAsync(int id, bool indexSite)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            seoSetting.IndexSite = indexSite;
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region Delete

        public async Task<bool> DeleteSeoSettingAsync(int id)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            _context.Set<SeoSetting>().Remove(seoSetting);
            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region SEO Validation

        public Task<bool> ValidateMetaTitleLengthAsync(string metaTitle)
        {
            bool isValid = !string.IsNullOrWhiteSpace(metaTitle) && metaTitle.Length <= 70;
            return Task.FromResult(isValid);
        }

        public Task<bool> ValidateMetaDescriptionLengthAsync(string metaDescription)
        {
            bool isValid = !string.IsNullOrWhiteSpace(metaDescription) && metaDescription.Length <= 160;
            return Task.FromResult(isValid);
        }

        public Task<bool> ValidateOgTitleLengthAsync(string ogTitle)
        {
            bool isValid = string.IsNullOrEmpty(ogTitle) || ogTitle.Length <= 70;
            return Task.FromResult(isValid);
        }

        public Task<bool> ValidateOgDescriptionLengthAsync(string ogDescription)
        {
            bool isValid = string.IsNullOrEmpty(ogDescription) || ogDescription.Length <= 200;
            return Task.FromResult(isValid);
        }

        #endregion

        #region Robots & Indexing

        public async Task<string> GenerateRobotsTxtAsync()
        {
            var globalSetting = await _context.Set<SeoSetting>().FirstOrDefaultAsync();

            if (globalSetting != null && !string.IsNullOrWhiteSpace(globalSetting.RobotsTxtContent))
            {
                return globalSetting.RobotsTxtContent;
            }

            bool isIndexingEnabled = globalSetting?.IndexSite ?? false;

            if (isIndexingEnabled)
            {
                return "User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: /sitemap.xml";
            }

            return "User-agent: *\nDisallow: /";
        }

        public async Task<string> GetRobotsTxtContentAsync()
        {
            return await GenerateRobotsTxtAsync();
        }

        public async Task<bool> IsIndexingEnabledAsync()
        {
            var globalSetting = await _context.Set<SeoSetting>().FirstOrDefaultAsync();
            return globalSetting?.IndexSite ?? false;
        }

        public async Task<bool> ToggleIndexingAsync(int id)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            seoSetting.IndexSite = !seoSetting.IndexSite;
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region Open Graph / Social Media

        public async Task<bool> UpdateOpenGraphSettingsAsync(int id, string ogTitle, string ogDescription, int? ogImageAssetId)
        {
            var seoSetting = await _context.Set<SeoSetting>().FindAsync(id);
            if (seoSetting == null) return false;

            if (ogImageAssetId.HasValue)
            {
                var assetExists = await IsFileAssetExistsAsync(ogImageAssetId.Value);
                if (!assetExists) return false;
            }

            seoSetting.OgTitle = ogTitle;
            seoSetting.OgDescription = ogDescription;
            seoSetting.OgImageAssetId = ogImageAssetId;
            seoSetting.UpdatedAt = DateTime.UtcNow;

            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region Analytics & Search Console

        public async Task<bool> HasGoogleAnalyticsAsync()
        {
            var globalSetting = await _context.Set<SeoSetting>().FirstOrDefaultAsync();
            return !string.IsNullOrWhiteSpace(globalSetting?.GoogleAnalyticsId);
        }

        public async Task<bool> HasGoogleSearchConsoleAsync()
        {
            var globalSetting = await _context.Set<SeoSetting>().FirstOrDefaultAsync();
            return !string.IsNullOrWhiteSpace(globalSetting?.GoogleSearchConsoleCode);
        }

        public async Task<string> GetGoogleAnalyticsIdAsync()
        {
            var globalSetting = await _context.Set<SeoSetting>().FirstOrDefaultAsync();
            return globalSetting?.GoogleAnalyticsId ?? string.Empty;
        }

        public async Task<string> GetGoogleSearchConsoleCodeAsync()
        {
            var globalSetting = await _context.Set<SeoSetting>().FirstOrDefaultAsync();
            return globalSetting?.GoogleSearchConsoleCode ?? string.Empty;
        }

        #endregion

        #region Validation & Check

        public async Task<bool> IsSeoSettingExistsAsync(int id)
        {
            return await _context.Set<SeoSetting>().AnyAsync(s => s.Id == id);
        }

        public async Task<bool> IsFileAssetExistsAsync(int fileAssetId)
        {
            return await _context.Set<FileAsset>().AnyAsync(f => f.Id == fileAssetId);
        }

        #endregion
    }
}
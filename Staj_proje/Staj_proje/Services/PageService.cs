using Mapster;
using Staj_proje.DTO.Page;
using Staj_proje.Entities;
using Staj_proje.Interfaces;
using System.Text.RegularExpressions;

namespace Staj_proje.Services
{
    /// <summary>
    /// Sayfa (Page) işlemlerini yöneten servis sınıfı.
    /// IPageService arayüzün tüm üyelerini implemente eder.
    /// </summary>
    public class PageService : IPageService
    {
        private readonly IPageRepository _pageRepository;
        private readonly IGenericRepository<FileAsset> _fileAssetRepository;
        private readonly IGenericRepository<SeoSetting> _seoSettingRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PageService(
            IPageRepository pageRepository,
            IGenericRepository<FileAsset> fileAssetRepository,
            IGenericRepository<SeoSetting> seoSettingRepository,
            IUnitOfWork unitOfWork)
        {
            _pageRepository = pageRepository;
            _fileAssetRepository = fileAssetRepository;
            _seoSettingRepository = seoSettingRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Yeni bir sayfa oluştur ve oluşturulan sayfanın ID'sini döndür.
        /// </summary>
        public async Task<int> CreatePageAsync(PageCreateDto createPageDto)
        {
            if (string.IsNullOrWhiteSpace(createPageDto.Title))
                throw new ArgumentException("Sayfa başlığı zorunludur.", nameof(createPageDto.Title));

            // Slug belirleme ve benzersizlik kontrolü
            string slug;
            if (!string.IsNullOrWhiteSpace(createPageDto.Slug))
            {
                slug = GenerateSlug(createPageDto.Slug);
                if (!await IsSlugUniqueAsync(slug))
                    throw new InvalidOperationException($"'{slug}' URL yolu (Slug) zaten kullanılıyor.");
            }
            else
            {
                slug = await GenerateUniqueSlugAsync(createPageDto.Title);
            }

            // Banner görseli kontrolü (varsa)
            if (createPageDto.BannerImageAssetId.HasValue)
            {
                var bannerImage = await _fileAssetRepository.GetByIdAsync(createPageDto.BannerImageAssetId.Value);
                if (bannerImage == null)
                    throw new InvalidOperationException($"Banner görseli (FileAsset) ID: {createPageDto.BannerImageAssetId.Value} bulunamadı.");
            }

            // SEO ayarı kontrolü (varsa)
            if (createPageDto.SeoSettingId.HasValue)
            {
                var seo = await _seoSettingRepository.GetByIdAsync(createPageDto.SeoSettingId.Value);
                if (seo == null)
                    throw new InvalidOperationException($"SEO ayarı ID: {createPageDto.SeoSettingId.Value} bulunamadı.");
            }

            var page = createPageDto.Adapt<Page>();
            page.Slug = slug;
            page.CreatedAt = DateTime.UtcNow;
            page.IsDeleted = false;

            await _pageRepository.AddAsync(page);
            await _unitOfWork.CommitAsync();

            return page.Id;
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre sayfayı tüm detaylarıyla getir.
        /// </summary>
        public async Task<PageDetailDto> GetPageByIdAsync(int id)
        {
            var page = await _pageRepository.GetByIdAsync(id);

            if (page == null || page.IsDeleted)
                throw new InvalidOperationException($"Sayfa ID: {id} bulunamadı.");

            return page.Adapt<PageDetailDto>();
        }

        /// <summary>
        /// URL Slug'a göre sayfayı tüm detaylarıyla getir.
        /// </summary>
        public async Task<PageDetailDto> GetPageBySlugAsync(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
                throw new ArgumentException("Slug boş olamaz.", nameof(slug));

            var formattedSlug = GenerateSlug(slug);
            var page = await _pageRepository.GetBySlugAsync(formattedSlug);

            if (page == null)
                throw new InvalidOperationException($"'{formattedSlug}' URL yoluna sahip sayfa bulunamadı.");

            return page.Adapt<PageDetailDto>();
        }

        /// <summary>
        /// Tüm sayfaları (silinmemiş olanları) listeler.
        /// </summary>
        public async Task<List<PageListDto>> GetAllPagesAsync()
        {
            var pages = await _pageRepository.FindAsync(p => !p.IsDeleted);
            return pages.OrderBy(p => p.DisplayOrder).Adapt<List<PageListDto>>();
        }

        /// <summary>
        /// Sadece aktif (IsActive = true) ve silinmemiş sayfaları listeler.
        /// </summary>
        public async Task<List<PageListDto>> GetActivePagesAsync()
        {
            var pages = await _pageRepository.FindAsync(p => p.IsActive && !p.IsDeleted);
            return pages.OrderBy(p => p.DisplayOrder).Adapt<List<PageListDto>>();
        }

        /// <summary>
        /// Sayfa türüne göre (Standart, Hizmet, İletişim, Landing) sayfaları listeler.
        /// </summary>
        public async Task<List<PageListDto>> GetPagesByTypeAsync(PageType type)
        {
            var pages = await _pageRepository.FindAsync(p => p.Type == type && !p.IsDeleted);
            return pages.OrderBy(p => p.DisplayOrder).Adapt<List<PageListDto>>();
        }

        /// <summary>
        /// Üst menüde (Header) gösterilecek aktif sayfaları sıra düzenine göre listeler.
        /// </summary>
        public async Task<List<PageListDto>> GetHeaderPagesAsync()
        {
            var pages = await _pageRepository.GetHeaderPagesAsync();
            return pages.Adapt<List<PageListDto>>();
        }

        /// <summary>
        /// Alt menüde (Footer) gösterilecek aktif sayfaları sıra düzenine göre listeler.
        /// </summary>
        public async Task<List<PageListDto>> GetFooterPagesAsync()
        {
            var pages = await _pageRepository.GetFooterPagesAsync();
            return pages.Adapt<List<PageListDto>>();
        }

        /// <summary>
        /// Hizmet (Service) türündeki sayfaları listeler.
        /// </summary>
        public async Task<List<PageListDto>> GetServicePagesAsync()
        {
            var pages = await _pageRepository.FindAsync(p => p.Type == PageType.Service && !p.IsDeleted);
            return pages.OrderBy(p => p.DisplayOrder).Adapt<List<PageListDto>>();
        }

        #endregion
        #region UPDATE

        /// <summary>
        /// Sayfa bilgilerini günceller.
        /// </summary>
        public async Task<bool> UpdatePageAsync(int id, PageUpdateDto updatePageDto)
        {
            var page = await _pageRepository.GetByIdAsync(id);

            if (page == null || page.IsDeleted)
                throw new InvalidOperationException($"Sayfa ID: {id} bulunamadı.");

            if (string.IsNullOrWhiteSpace(updatePageDto.Title))
                throw new ArgumentException("Sayfa başlığı zorunludur.", nameof(updatePageDto.Title));

            // Slug belirleme ve benzersizlik kontrolü
            string slug;
            if (!string.IsNullOrWhiteSpace(updatePageDto.Slug))
            {
                slug = GenerateSlug(updatePageDto.Slug);
                if (!await IsSlugUniqueAsync(slug, id))
                    throw new InvalidOperationException($"'{slug}' URL yolu (Slug) başka bir sayfa tarafından kullanılıyor.");
            }
            else
            {
                slug = await GenerateUniqueSlugAsync(updatePageDto.Title, id);
            }

            // Banner görseli kontrolü (varsa)
            if (updatePageDto.BannerImageAssetId.HasValue)
            {
                var bannerImage = await _fileAssetRepository.GetByIdAsync(updatePageDto.BannerImageAssetId.Value);
                if (bannerImage == null)
                    throw new InvalidOperationException($"Banner görseli (FileAsset) ID: {updatePageDto.BannerImageAssetId.Value} bulunamadı.");
            }

            // SEO ayarı kontrolü (varsa)
            if (updatePageDto.SeoSettingId.HasValue)
            {
                var seo = await _seoSettingRepository.GetByIdAsync(updatePageDto.SeoSettingId.Value);
                if (seo == null)
                    throw new InvalidOperationException($"SEO ayarı ID: {updatePageDto.SeoSettingId.Value} bulunamadı.");
            }

            updatePageDto.Adapt(page);
            page.Slug = slug;
            page.UpdatedAt = DateTime.UtcNow;

            _pageRepository.Update(page);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Sayfayı aktif yapar (IsActive = true).
        /// </summary>
        public async Task<bool> ActivatePageAsync(int id)
        {
            var page = await _pageRepository.GetByIdAsync(id);

            if (page == null || page.IsDeleted)
                throw new InvalidOperationException($"Sayfa ID: {id} bulunamadı.");

            page.IsActive = true;
            page.UpdatedAt = DateTime.UtcNow;

            _pageRepository.Update(page);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Sayfayı pasif yapar (IsActive = false).
        /// </summary>
        public async Task<bool> DeactivatePageAsync(int id)
        {
            var page = await _pageRepository.GetByIdAsync(id);

            if (page == null || page.IsDeleted)
                throw new InvalidOperationException($"Sayfa ID: {id} bulunamadı.");

            page.IsActive = false;
            page.UpdatedAt = DateTime.UtcNow;

            _pageRepository.Update(page);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Sayfanın sıralama sırasını günceller.
        /// </summary>
        public async Task<bool> UpdateDisplayOrderAsync(int id, int displayOrder)
        {
            var page = await _pageRepository.GetByIdAsync(id);

            if (page == null || page.IsDeleted)
                throw new InvalidOperationException($"Sayfa ID: {id} bulunamadı.");

            page.DisplayOrder = displayOrder;
            page.UpdatedAt = DateTime.UtcNow;

            _pageRepository.Update(page);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Sayfanın üst menüde (Header) görünürlüğünü tersine çevir.
        /// </summary>
        public async Task<bool> ToggleHeaderVisibilityAsync(int id)
        {
            var page = await _pageRepository.GetByIdAsync(id);

            if (page == null || page.IsDeleted)
                throw new InvalidOperationException($"Sayfa ID: {id} bulunamadı.");

            page.ShowInHeader = !page.ShowInHeader;
            page.UpdatedAt = DateTime.UtcNow;

            _pageRepository.Update(page);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Sayfanın alt menüde (Footer) görünürlüğünü tersine çevir.
        /// </summary>
        public async Task<bool> ToggleFooterVisibilityAsync(int id)
        {
            var page = await _pageRepository.GetByIdAsync(id);

            if (page == null || page.IsDeleted)
                throw new InvalidOperationException($"Sayfa ID: {id} bulunamadı.");

            page.ShowInFooter = !page.ShowInFooter;
            page.UpdatedAt = DateTime.UtcNow;

            _pageRepository.Update(page);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion
        #region DELETE

        /// <summary>
        /// Sayfayı siler (Soft Delete - IsDeleted = true).
        /// </summary>
        public async Task<bool> DeletePageAsync(int id)
        {
            var page = await _pageRepository.GetByIdAsync(id);

            if (page == null)
                throw new InvalidOperationException($"Sayfa ID: {id} bulunamadı.");

            if (page.IsDeleted)
                throw new InvalidOperationException("Bu sayfa zaten silinmiş durumda.");

            _pageRepository.Remove(page); // Soft Delete
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Silinen sayfayı geri yükler (IsDeleted = false).
        /// </summary>
        public async Task<bool> RestorePageAsync(int id)
        {
            var page = await _pageRepository.GetByIdAsync(id);

            if (page == null)
                throw new InvalidOperationException($"Sayfa ID: {id} bulunamadı.");

            if (!page.IsDeleted)
                throw new InvalidOperationException("Bu sayfa silinmemiş durumda.");

            _pageRepository.Restore(page);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Sayfayı veritabanından kalıcı olarak siler (Hard Delete).
        /// </summary>
        public async Task<bool> PermanentlyDeletePageAsync(int id)
        {
            var page = await _pageRepository.GetByIdAsync(id);

            if (page == null)
                throw new InvalidOperationException($"Sayfa ID: {id} bulunamadı.");

            _pageRepository.HardDelete(page);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region SEARCH & FILTER

        /// <summary>
        /// Başlığa göre sayfa arar.
        /// </summary>
        public async Task<List<PageListDto>> SearchPagesByTitleAsync(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Arama metni boş olamaz.", nameof(title));

            var trimmedTitle = title.Trim();
            var pages = await _pageRepository.FindAsync(p =>
                !p.IsDeleted && p.Title.Contains(trimmedTitle));

            return pages.OrderBy(p => p.DisplayOrder).Adapt<List<PageListDto>>();
        }

        /// <summary>
        /// Slug'a göre sayfa arar.
        /// </summary>
        public async Task<List<PageListDto>> SearchPagesBySlugAsync(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
                throw new ArgumentException("Arama metni boş olamaz.", nameof(slug));

            var trimmedSlug = slug.Trim();
            var pages = await _pageRepository.FindAsync(p =>
                !p.IsDeleted && p.Slug.Contains(trimmedSlug));

            return pages.OrderBy(p => p.DisplayOrder).Adapt<List<PageListDto>>();
        }

        /// <summary>
        /// Belirli bir tarih aralığında oluşturulan sayfaları listeler.
        /// </summary>
        public async Task<List<PageListDto>> GetPagesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
                throw new ArgumentException("Başlangıç tarihi bitiş tarihinden sonra olamaz.");

            var pages = await _pageRepository.FindAsync(p =>
                !p.IsDeleted &&
                p.CreatedAt >= startDate &&
                p.CreatedAt <= endDate);

            return pages.OrderByDescending(p => p.CreatedAt).Adapt<List<PageListDto>>();
        }

        #endregion
        #region VALIDATION & CHECK

        /// <summary>
        /// Sayfanın var olup olmadığını kontrol eder (silinmemiş olarak).
        /// </summary>
        public async Task<bool> IsPageExistsAsync(int id)
        {
            var page = await _pageRepository.GetByIdAsync(id);
            return page != null && !page.IsDeleted;
        }

        /// <summary>
        /// Belirtilen slug'a sahip bir sayfanın var olup olmadığını kontrol eder.
        /// </summary>
        public async Task<bool> IsPageExistsBySlugAsync(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
                return false;

            var formattedSlug = GenerateSlug(slug);
            var pages = await _pageRepository.FindAsync(p => p.Slug == formattedSlug && !p.IsDeleted);
            return pages.Any();
        }

        /// <summary>
        /// Belirtilen slug'ın benzersiz olup olmadığını kontrol eder.
        /// </summary>
        public async Task<bool> IsSlugUniqueAsync(string slug, int? excludePageId = null)
        {
            if (string.IsNullOrWhiteSpace(slug))
                return false;

            var formattedSlug = GenerateSlug(slug);
            var pages = await _pageRepository.FindAsync(p => p.Slug == formattedSlug);

            if (excludePageId.HasValue)
                return !pages.Any(p => p.Id != excludePageId.Value);

            return !pages.Any();
        }

        #endregion

        #region SEO

        /// <summary>
        /// Sayfaya SEO ayarı atar.
        /// </summary>
        public async Task<bool> UpdatePageSeoAsync(int pageId, int seoSettingId)
        {
            var page = await _pageRepository.GetByIdAsync(pageId);

            if (page == null || page.IsDeleted)
                throw new InvalidOperationException($"Sayfa ID: {pageId} bulunamadı.");

            var seo = await _seoSettingRepository.GetByIdAsync(seoSettingId);
            if (seo == null)
                throw new InvalidOperationException($"SEO ayarı ID: {seoSettingId} bulunamadı.");

            page.SeoSettingId = seoSettingId;
            page.UpdatedAt = DateTime.UtcNow;

            _pageRepository.Update(page);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Sayfadan SEO ayarını kaldır.
        /// </summary>
        public async Task<bool> RemovePageSeoAsync(int pageId)
        {
            var page = await _pageRepository.GetByIdAsync(pageId);

            if (page == null || page.IsDeleted)
                throw new InvalidOperationException($"Sayfa ID: {pageId} bulunamadı.");

            page.SeoSettingId = null;
            page.UpdatedAt = DateTime.UtcNow;

            _pageRepository.Update(page);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region VALIDATION & UTILS

        /// <summary>
        /// Başlıktan benzersiz bir URL slug oluştur.
        /// </summary>
        public async Task<string> GenerateUniqueSlugAsync(string title, int? currentId = null)
        {
            var baseSlug = GenerateSlug(title);
            if (string.IsNullOrEmpty(baseSlug))
                baseSlug = "page";

            var slug = baseSlug;
            var counter = 1;

            while (!await IsSlugUniqueAsync(slug, currentId))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }

            return slug;
        }

        /// <summary>
        /// Metni URL-dostu slug formatına çevir.
        /// </summary>
        private static string GenerateSlug(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;

            var slug = text.Trim().ToLowerInvariant();

            // Türkçe karakter dönüşümü
            slug = slug.Replace("ı", "i")
                       .Replace("ğ", "g")
                       .Replace("ü", "u")
                       .Replace("ş", "s")
                       .Replace("ö", "o")
                       .Replace("ç", "c");

            // Geçersiz karakterleri temizle
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            // Çoklu boşlukları tek boşluğa indir
            slug = Regex.Replace(slug, @"\s+", " ").Trim();
            // Boşlukları tire yap
            slug = Regex.Replace(slug, @"\s", "-");
            // Çoklu tireleri teke indir
            slug = Regex.Replace(slug, @"-+", "-");

            return slug;
        }

        #endregion
    }
}

using Mapster;
using Staj_proje.DTO.GalleyItem;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    /// <summary>
    /// Galeri öğesi (GalleryItem) işlemlerini yöneten servis sınıfı.
    /// IGalleryItemService arayüzünün tüm üyelerini implemente eder.
    /// </summary>
    public class GalleryItemService : IGalleryItemService
    {
        private readonly IGenericRepository<GalleryItem> _galleryItemRepository;
        private readonly IGenericRepository<Company> _companyRepository;
        private readonly IGenericRepository<FileAsset> _fileAssetRepository;
        private readonly IUnitOfWork _unitOfWork;

        public GalleryItemService(
            IGenericRepository<GalleryItem> galleryItemRepository,
            IGenericRepository<Company> companyRepository,
            IGenericRepository<FileAsset> fileAssetRepository,
            IUnitOfWork unitOfWork)
        {
            _galleryItemRepository = galleryItemRepository;
            _companyRepository = companyRepository;
            _fileAssetRepository = fileAssetRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Yeni bir galeri öğesi oluşturur ve oluşturulan kaydın ID'sini döndürür.
        /// </summary>
        public async Task<int> CreateGalleryItemAsync(GalleryItemCreateDto createGalleryItemDto)
        {
            if (!await IsCompanyExistsAsync(createGalleryItemDto.CompanyId))
                throw new InvalidOperationException($"Şirket (Company) ID: {createGalleryItemDto.CompanyId} bulunamadı.");

            if (!await IsFileAssetExistsAsync(createGalleryItemDto.FileAssetId))
                throw new InvalidOperationException($"Medya dosyası (FileAsset) ID: {createGalleryItemDto.FileAssetId} bulunamadı.");

            var galleryItem = createGalleryItemDto.Adapt<GalleryItem>();
            galleryItem.CreatedAt = DateTime.UtcNow;
            galleryItem.IsDeleted = false;

            await _galleryItemRepository.AddAsync(galleryItem);
            await _unitOfWork.CommitAsync();

            return galleryItem.Id;
        }

        /// <summary>
        /// Birden fazla galeri öğesini tek seferde oluşturur ve oluşturulan ID'leri döndürür.
        /// </summary>
        public async Task<List<int>> CreateMultipleGalleryItemsAsync(List<GalleryItemCreateDto> createGalleryItemDtos)
        {
            if (createGalleryItemDtos == null || createGalleryItemDtos.Count == 0)
                throw new ArgumentException("En az bir galeri öğesi gönderilmelidir.", nameof(createGalleryItemDtos));

            var createdIds = new List<int>();

            foreach (var dto in createGalleryItemDtos)
            {
                var id = await CreateGalleryItemAsync(dto);
                createdIds.Add(id);
            }

            return createdIds;
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre galeri öğesini getirir.
        /// </summary>
        public async Task<GalleryItemResponseDto> GetGalleryItemByIdAsync(int id)
        {
            var galleryItem = await _galleryItemRepository.GetByIdAsync(id);

            if (galleryItem == null || galleryItem.IsDeleted)
                throw new InvalidOperationException($"Galeri öğesi ID: {id} bulunamadı.");

            return await MapToResponseDtoAsync(galleryItem);
        }

        /// <summary>
        /// Silinmemiş tüm galeri öğelerini listeler.
        /// </summary>
        public async Task<List<GalleryItemResponseDto>> GetAllGalleryItemsAsync()
        {
            var galleryItems = await _galleryItemRepository.FindAsync(g => !g.IsDeleted);
            return await MapToResponseDtosAsync(galleryItems.OrderBy(g => g.DisplayOrder).ToList());
        }

        /// <summary>
        /// Belirli bir şirkete ait tüm galeri öğelerini listeler.
        /// </summary>
        public async Task<List<GalleryItemResponseDto>> GetGalleryItemsByCompanyAsync(int companyId)
        {
            if (!await IsCompanyExistsAsync(companyId))
                throw new InvalidOperationException($"Şirket ID: {companyId} bulunamadı.");

            var galleryItems = await _galleryItemRepository.FindAsync(g => !g.IsDeleted && g.CompanyId == companyId);
            return await MapToResponseDtosAsync(galleryItems.OrderBy(g => g.DisplayOrder).ToList());
        }

        /// <summary>
        /// Belirli bir şirkete ait aktif galeri öğelerini listeler.
        /// </summary>
        public async Task<List<GalleryItemResponseDto>> GetActiveGalleryItemsByCompanyAsync(int companyId)
        {
            if (!await IsCompanyExistsAsync(companyId))
                throw new InvalidOperationException($"Şirket ID: {companyId} bulunamadı.");

            var galleryItems = await _galleryItemRepository.FindAsync(g =>
                !g.IsDeleted && g.CompanyId == companyId && g.IsActive);

            return await MapToResponseDtosAsync(galleryItems.OrderBy(g => g.DisplayOrder).ToList());
        }

        /// <summary>
        /// Belirli bir şirkete ait öne çıkan galeri öğelerini listeler.
        /// </summary>
        public async Task<List<GalleryItemResponseDto>> GetFeaturedGalleryItemsByCompanyAsync(int companyId)
        {
            if (!await IsCompanyExistsAsync(companyId))
                throw new InvalidOperationException($"Şirket ID: {companyId} bulunamadı.");

            var galleryItems = await _galleryItemRepository.FindAsync(g =>
                !g.IsDeleted && g.CompanyId == companyId && g.IsFeatured && g.IsActive);

            return await MapToResponseDtosAsync(galleryItems.OrderBy(g => g.DisplayOrder).ToList());
        }

        /// <summary>
        /// Belirli bir şirkete ait galeri öğelerini sıralama düzenine göre listeler.
        /// </summary>
        public async Task<List<GalleryItemResponseDto>> GetGalleryItemsByCompanyOrderedAsync(int companyId)
        {
            if (!await IsCompanyExistsAsync(companyId))
                throw new InvalidOperationException($"Şirket ID: {companyId} bulunamadı.");

            var galleryItems = await _galleryItemRepository.FindAsync(g => !g.IsDeleted && g.CompanyId == companyId);
            return await MapToResponseDtosAsync(galleryItems.OrderBy(g => g.DisplayOrder).ThenByDescending(g => g.CreatedAt).ToList());
        }

        #endregion

        #region UPDATE

        /// <summary>
        /// Galeri öğesi bilgilerini günceller.
        /// </summary>
        public async Task<bool> UpdateGalleryItemAsync(int id, GalleryItemUpdateDto updateGalleryItemDto)
        {
            var galleryItem = await _galleryItemRepository.GetByIdAsync(id);

            if (galleryItem == null || galleryItem.IsDeleted)
                throw new InvalidOperationException($"Galeri öğesi ID: {id} bulunamadı.");

            if (!await IsFileAssetExistsAsync(updateGalleryItemDto.FileAssetId))
                throw new InvalidOperationException($"Medya dosyası (FileAsset) ID: {updateGalleryItemDto.FileAssetId} bulunamadı.");

            updateGalleryItemDto.Adapt(galleryItem);

            _galleryItemRepository.Update(galleryItem);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Galeri öğesini aktifleştirir (IsActive = true).
        /// </summary>
        public async Task<bool> ActivateGalleryItemAsync(int id)
        {
            var galleryItem = await GetExistingGalleryItemAsync(id);

            if (galleryItem.IsActive)
                throw new InvalidOperationException("Bu galeri öğesi zaten aktif durumda.");

            galleryItem.IsActive = true;

            _galleryItemRepository.Update(galleryItem);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Galeri öğesini pasifleştirir (IsActive = false).
        /// </summary>
        public async Task<bool> DeactivateGalleryItemAsync(int id)
        {
            var galleryItem = await GetExistingGalleryItemAsync(id);

            if (!galleryItem.IsActive)
                throw new InvalidOperationException("Bu galeri öğesi zaten pasif durumda.");

            galleryItem.IsActive = false;

            _galleryItemRepository.Update(galleryItem);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Galeri öğesini öne çıkarır (IsFeatured = true).
        /// </summary>
        public async Task<bool> FeatureGalleryItemAsync(int id)
        {
            var galleryItem = await GetExistingGalleryItemAsync(id);

            if (galleryItem.IsFeatured)
                throw new InvalidOperationException("Bu galeri öğesi zaten öne çıkarılmış durumda.");

            galleryItem.IsFeatured = true;

            _galleryItemRepository.Update(galleryItem);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Galeri öğesinin öne çıkarılmasını kaldırır (IsFeatured = false).
        /// </summary>
        public async Task<bool> UnfeatureGalleryItemAsync(int id)
        {
            var galleryItem = await GetExistingGalleryItemAsync(id);

            if (!galleryItem.IsFeatured)
                throw new InvalidOperationException("Bu galeri öğesi zaten öne çıkarılmamış durumda.");

            galleryItem.IsFeatured = false;

            _galleryItemRepository.Update(galleryItem);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Galeri öğesinin sıralama değerini günceller.
        /// </summary>
        public async Task<bool> UpdateDisplayOrderAsync(int id, int displayOrder)
        {
            var galleryItem = await GetExistingGalleryItemAsync(id);

            galleryItem.DisplayOrder = displayOrder;

            _galleryItemRepository.Update(galleryItem);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region DELETE

        /// <summary>
        /// Galeri öğesini siler (Soft Delete - IsDeleted = true).
        /// </summary>
        public async Task<bool> DeleteGalleryItemAsync(int id)
        {
            var galleryItem = await _galleryItemRepository.GetByIdAsync(id);

            if (galleryItem == null)
                throw new InvalidOperationException($"Galeri öğesi ID: {id} bulunamadı.");

            if (galleryItem.IsDeleted)
                throw new InvalidOperationException("Bu galeri öğesi zaten silinmiş durumda.");

            galleryItem.IsDeleted = true;

            _galleryItemRepository.Update(galleryItem);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Silinen galeri öğesini geri yükler (IsDeleted = false).
        /// </summary>
        public async Task<bool> RestoreGalleryItemAsync(int id)
        {
            var galleryItem = await _galleryItemRepository.GetByIdAsync(id);

            if (galleryItem == null)
                throw new InvalidOperationException($"Galeri öğesi ID: {id} bulunamadı.");

            if (!galleryItem.IsDeleted)
                throw new InvalidOperationException("Bu galeri öğesi silinmemiş durumda.");

            galleryItem.IsDeleted = false;

            _galleryItemRepository.Update(galleryItem);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Galeri öğesini veritabanından kalıcı olarak siler (Hard Delete).
        /// </summary>
        public async Task<bool> PermanentlyDeleteGalleryItemAsync(int id)
        {
            var galleryItem = await _galleryItemRepository.GetByIdAsync(id);

            if (galleryItem == null)
                throw new InvalidOperationException($"Galeri öğesi ID: {id} bulunamadı.");

            _galleryItemRepository.HardDelete(galleryItem);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Belirli bir şirkete ait tüm galeri öğelerini siler (Soft Delete).
        /// </summary>
        public async Task<bool> DeleteGalleryItemsByCompanyAsync(int companyId)
        {
            if (!await IsCompanyExistsAsync(companyId))
                throw new InvalidOperationException($"Şirket ID: {companyId} bulunamadı.");

            var galleryItems = await _galleryItemRepository.FindAsync(g => !g.IsDeleted && g.CompanyId == companyId);

            if (galleryItems.Count == 0)
                return true;

            foreach (var galleryItem in galleryItems)
            {
                galleryItem.IsDeleted = true;
                _galleryItemRepository.Update(galleryItem);
            }

            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region VALIDATION & CHECK

        /// <summary>
        /// Galeri öğesinin var olup olmadığını kontrol eder (silinmemiş olarak).
        /// </summary>
        public async Task<bool> IsGalleryItemExistsAsync(int id)
        {
            var galleryItem = await _galleryItemRepository.GetByIdAsync(id);
            return galleryItem != null && !galleryItem.IsDeleted;
        }

        /// <summary>
        /// Şirketin var olup olmadığını kontrol eder.
        /// </summary>
        public async Task<bool> IsCompanyExistsAsync(int companyId)
        {
            var company = await _companyRepository.GetByIdAsync(companyId);
            return company != null && !company.IsDeleted;
        }

        /// <summary>
        /// Medya dosyasının (FileAsset) var olup olmadığını kontrol eder.
        /// </summary>
        public async Task<bool> IsFileAssetExistsAsync(int fileAssetId)
        {
            var fileAsset = await _fileAssetRepository.GetByIdAsync(fileAssetId);
            return fileAsset != null;
        }

        #endregion

        #region PRIVATE HELPERS

        /// <summary>
        /// Silinmemiş galeri öğesini getirir; bulunamazsa hata fırlatır.
        /// </summary>
        private async Task<GalleryItem> GetExistingGalleryItemAsync(int id)
        {
            var galleryItem = await _galleryItemRepository.GetByIdAsync(id);

            if (galleryItem == null || galleryItem.IsDeleted)
                throw new InvalidOperationException($"Galeri öğesi ID: {id} bulunamadı.");

            return galleryItem;
        }

        /// <summary>
        /// Tek bir GalleryItem entity'sini Company ve FileAsset bilgileriyle birlikte DTO'ya dönüştürür.
        /// </summary>
        private async Task<GalleryItemResponseDto> MapToResponseDtoAsync(GalleryItem galleryItem)
        {
            var company = await _companyRepository.GetByIdAsync(galleryItem.CompanyId);
            var fileAsset = await _fileAssetRepository.GetByIdAsync(galleryItem.FileAssetId);

            if (company != null)
                galleryItem.Company = company;

            if (fileAsset != null)
                galleryItem.FileAsset = fileAsset;

            return galleryItem.Adapt<GalleryItemResponseDto>();
        }

        /// <summary>
        /// GalleryItem listesini toplu olarak Company ve FileAsset bilgileriyle DTO listesine dönüştürür.
        /// </summary>
        private async Task<List<GalleryItemResponseDto>> MapToResponseDtosAsync(List<GalleryItem> galleryItems)
        {
            if (galleryItems.Count == 0)
                return new List<GalleryItemResponseDto>();

            var companyIds = galleryItems.Select(g => g.CompanyId).Distinct().ToList();
            var fileAssetIds = galleryItems.Select(g => g.FileAssetId).Distinct().ToList();

            var companies = (await _companyRepository.FindAsync(c => companyIds.Contains(c.Id)))
                .ToDictionary(c => c.Id);

            var fileAssets = (await _fileAssetRepository.FindAsync(f => fileAssetIds.Contains(f.Id)))
                .ToDictionary(f => f.Id);

            return galleryItems.Select(item =>
            {
                if (companies.TryGetValue(item.CompanyId, out var company))
                    item.Company = company;

                if (fileAssets.TryGetValue(item.FileAssetId, out var fileAsset))
                    item.FileAsset = fileAsset;

                return item.Adapt<GalleryItemResponseDto>();
            }).ToList();
        }

        #endregion
    }
}

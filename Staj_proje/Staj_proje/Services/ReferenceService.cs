using Mapster;
using Staj_proje.DTO.Reference;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    /// <summary>
    /// Referans (Reference) işlemlerini yöneten servis sınıfı.
    /// IReferenceService arayüzün tüm üyelerini implemente eder.
    /// </summary>
    public class ReferenceService : IReferenceService
    {
        private readonly IGenericRepository<Reference> _referenceRepository;
        private readonly IGenericRepository<FileAsset> _fileAssetRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ReferenceService(
            IGenericRepository<Reference> referenceRepository,
            IGenericRepository<FileAsset> fileAssetRepository,
            IUnitOfWork unitOfWork)
        {
            _referenceRepository = referenceRepository;
            _fileAssetRepository = fileAssetRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Yeni bir referans oluştur ve oluşturulan referansın ID'sini döndür.
        /// </summary>
        public async Task<int> CreateReferenceAsync(ReferenceCreateDto createReferenceDto)
        {
            if (string.IsNullOrWhiteSpace(createReferenceDto.Name))
                throw new ArgumentException("Referans firma adı zorunludur.", nameof(createReferenceDto.Name));

            if (await IsReferenceNameExistsAsync(createReferenceDto.Name))
                throw new InvalidOperationException($"'{createReferenceDto.Name}' adında bir referans zaten mevcut.");

            if (!await IsFileAssetExistsAsync(createReferenceDto.LogoFileAssetId))
                throw new InvalidOperationException($"Logo görseli (FileAsset) ID: {createReferenceDto.LogoFileAssetId} bulunamadı.");

            var reference = createReferenceDto.Adapt<Reference>();
            reference.CreatedAt = DateTime.UtcNow;
            reference.IsDeleted = false;

            await _referenceRepository.AddAsync(reference);
            await _unitOfWork.CommitAsync();

            return reference.Id;
        }

        /// <summary>
        /// Birden fazla referansı tek seferde oluştur ve oluşturulan ID'leri döndür.
        /// </summary>
        public async Task<List<int>> CreateMultipleReferencesAsync(List<ReferenceCreateDto> createReferenceDtos)
        {
            if (createReferenceDtos == null || createReferenceDtos.Count == 0)
                throw new ArgumentException("En az bir referans gönderilmelidir.", nameof(createReferenceDtos));

            var createdIds = new List<int>();

            foreach (var dto in createReferenceDtos)
            {
                var id = await CreateReferenceAsync(dto);
                createdIds.Add(id);
            }

            return createdIds;
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre referansı getir.
        /// </summary>
        public async Task<ReferenceResponseDto> GetReferenceByIdAsync(int id)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);

            if (reference == null || reference.IsDeleted)
                throw new InvalidOperationException($"Referans ID: {id} bulunamadı.");

            return reference.Adapt<ReferenceResponseDto>();
        }

        /// <summary>
        /// Tüm referansları (silinmemiş olanları) sayfalı olarak listeler.
        /// </summary>
        public async Task<List<ReferenceResponseDto>> GetAllReferencesAsync(int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var references = await _referenceRepository.FindAsync(r => !r.IsDeleted);
            return references.OrderBy(r => r.DisplayOrder).Skip((page - 1) * size).Take(size).Adapt<List<ReferenceResponseDto>>();
        }

        /// <summary>
        /// Sadece aktif (IsActive = true) ve silinmemiş referansları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<ReferenceResponseDto>> GetActiveReferencesAsync(int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var references = await _referenceRepository.FindAsync(r => r.IsActive && !r.IsDeleted);
            return references.OrderBy(r => r.DisplayOrder).Skip((page - 1) * size).Take(size).Adapt<List<ReferenceResponseDto>>();
        }

        /// <summary>
        /// Ana sayfada gösterilecek (IsShowOnHome = true) aktif referansları listeler.
        /// </summary>
        public async Task<List<ReferenceResponseDto>> GetHomePageReferencesAsync()
        {
            var references = await _referenceRepository.FindAsync(r => r.IsShowOnHome && r.IsActive && !r.IsDeleted);
            return references.OrderBy(r => r.DisplayOrder).Adapt<List<ReferenceResponseDto>>();
        }

        /// <summary>
        /// Referans türüne göre (Client, Partner, Sponsor) referansları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<ReferenceResponseDto>> GetReferencesByTypeAsync(ReferenceType type, int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var references = await _referenceRepository.FindAsync(r => r.Type == type && !r.IsDeleted);
            return references.OrderBy(r => r.DisplayOrder).Skip((page - 1) * size).Take(size).Adapt<List<ReferenceResponseDto>>();
        }

        /// <summary>
        /// Müşteri (Client) türündeki referansları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<ReferenceResponseDto>> GetClientReferencesAsync(int pageNumber = 1, int pageSize = 20)
            => await GetReferencesByTypeAsync(ReferenceType.Client, pageNumber, pageSize);

        /// <summary>
        /// İş ortağı (Partner) türündeki referansları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<ReferenceResponseDto>> GetPartnerReferencesAsync(int pageNumber = 1, int pageSize = 20)
            => await GetReferencesByTypeAsync(ReferenceType.Partner, pageNumber, pageSize);

        /// <summary>
        /// Sponsor türündeki referansları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<ReferenceResponseDto>> GetSponsorReferencesAsync(int pageNumber = 1, int pageSize = 20)
            => await GetReferencesByTypeAsync(ReferenceType.Sponsor, pageNumber, pageSize);

        /// <summary>
        /// Sektöre göre referansları sayfalı olarak listeler.
        /// </summary>
        public async Task<List<ReferenceResponseDto>> GetReferencesBySectorAsync(string sector, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(sector))
                throw new ArgumentException("Sektör bilgisi boş olamaz.", nameof(sector));

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var trimmedSector = sector.Trim();
            var references = await _referenceRepository.FindAsync(r =>
                !r.IsDeleted && r.Sector != null && r.Sector.Contains(trimmedSector));

            return references.OrderBy(r => r.DisplayOrder).Skip((page - 1) * size).Take(size).Adapt<List<ReferenceResponseDto>>();
        }

        #endregion
        #region UPDATE

        /// <summary>
        /// Referans bilgilerini günceller.
        /// </summary>
        public async Task<bool> UpdateReferenceAsync(int id, ReferenceUpdateDto updateReferenceDto)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);

            if (reference == null || reference.IsDeleted)
                throw new InvalidOperationException($"Referans ID: {id} bulunamadı.");

            if (string.IsNullOrWhiteSpace(updateReferenceDto.Name))
                throw new ArgumentException("Referans firma adı zorunludur.", nameof(updateReferenceDto.Name));

            if (await IsReferenceNameExistsAsync(updateReferenceDto.Name, id))
                throw new InvalidOperationException($"'{updateReferenceDto.Name}' adında başka bir referans mevcut.");

            if (!await IsFileAssetExistsAsync(updateReferenceDto.LogoFileAssetId))
                throw new InvalidOperationException($"Logo görseli (FileAsset) ID: {updateReferenceDto.LogoFileAssetId} bulunamadı.");

            updateReferenceDto.Adapt(reference);

            _referenceRepository.Update(reference);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Referansı aktif yapar (IsActive = true).
        /// </summary>
        public async Task<bool> ActivateReferenceAsync(int id)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);

            if (reference == null || reference.IsDeleted)
                throw new InvalidOperationException($"Referans ID: {id} bulunamadı.");

            reference.IsActive = true;

            _referenceRepository.Update(reference);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Referansı pasif yapar (IsActive = false).
        /// </summary>
        public async Task<bool> DeactivateReferenceAsync(int id)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);

            if (reference == null || reference.IsDeleted)
                throw new InvalidOperationException($"Referans ID: {id} bulunamadı.");

            reference.IsActive = false;

            _referenceRepository.Update(reference);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Referansı ana sayfada göster (IsShowOnHome = true).
        /// </summary>
        public async Task<bool> ShowOnHomeAsync(int id)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);

            if (reference == null || reference.IsDeleted)
                throw new InvalidOperationException($"Referans ID: {id} bulunamadı.");

            reference.IsShowOnHome = true;

            _referenceRepository.Update(reference);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Referansı ana sayfadan gizle (IsShowOnHome = false).
        /// </summary>
        public async Task<bool> HideFromHomeAsync(int id)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);

            if (reference == null || reference.IsDeleted)
                throw new InvalidOperationException($"Referans ID: {id} bulunamadı.");

            reference.IsShowOnHome = false;

            _referenceRepository.Update(reference);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Referansın sıralama sırasını günceller.
        /// </summary>
        public async Task<bool> UpdateDisplayOrderAsync(int id, int displayOrder)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);

            if (reference == null || reference.IsDeleted)
                throw new InvalidOperationException($"Referans ID: {id} bulunamadı.");

            reference.DisplayOrder = displayOrder;

            _referenceRepository.Update(reference);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Referansın logo görselini günceller.
        /// </summary>
        public async Task<bool> UpdateLogoAsync(int id, int fileAssetId)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);

            if (reference == null || reference.IsDeleted)
                throw new InvalidOperationException($"Referans ID: {id} bulunamadı.");

            if (!await IsFileAssetExistsAsync(fileAssetId))
                throw new InvalidOperationException($"Dosya (FileAsset) ID: {fileAssetId} bulunamadı.");

            reference.LogoFileAssetId = fileAssetId;

            _referenceRepository.Update(reference);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion
        #region DELETE

        /// <summary>
        /// Referansı siler (Soft Delete - IsDeleted = true).
        /// </summary>
        public async Task<bool> DeleteReferenceAsync(int id)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);

            if (reference == null)
                throw new InvalidOperationException($"Referans ID: {id} bulunamadı.");

            if (reference.IsDeleted)
                throw new InvalidOperationException("Bu referans zaten silinmiş durumda.");

            _referenceRepository.Remove(reference); // Soft Delete
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Silinen referansı geri yükler (IsDeleted = false).
        /// </summary>
        public async Task<bool> RestoreReferenceAsync(int id)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);

            if (reference == null)
                throw new InvalidOperationException($"Referans ID: {id} bulunamadı.");

            if (!reference.IsDeleted)
                throw new InvalidOperationException("Bu referans silinmemiş durumda.");

            _referenceRepository.Restore(reference);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Referansı veritabanından kalıcı olarak siler (Hard Delete).
        /// </summary>
        public async Task<bool> PermanentlyDeleteReferenceAsync(int id)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);

            if (reference == null)
                throw new InvalidOperationException($"Referans ID: {id} bulunamadı.");

            _referenceRepository.HardDelete(reference);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region REORDERING

        /// <summary>
        /// Referansların sıralama düzenini verilen ID listesine göre günceller.
        /// </summary>
        public async Task<bool> ReorderReferencesAsync(List<int> referenceIds)
        {
            if (referenceIds == null || referenceIds.Count == 0)
                throw new ArgumentException("Sıralama listesi boş olamaz.", nameof(referenceIds));

            var references = await _referenceRepository.FindAsync(r => !r.IsDeleted);
            var referenceMap = references.ToDictionary(r => r.Id);

            for (int i = 0; i < referenceIds.Count; i++)
            {
                if (referenceMap.TryGetValue(referenceIds[i], out var reference))
                    reference.DisplayOrder = i;
            }

            foreach (var reference in references)
                _referenceRepository.Update(reference);

            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region SEARCH & FILTER

        /// <summary>
        /// Firma adına göre referans arar (sayfalı).
        /// </summary>
        public async Task<List<ReferenceResponseDto>> SearchReferencesByNameAsync(string name, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Arama metni boş olamaz.", nameof(name));

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var trimmedName = name.Trim();
            var references = await _referenceRepository.FindAsync(r =>
                !r.IsDeleted && r.Name.Contains(trimmedName));

            return references.OrderBy(r => r.DisplayOrder).Skip((page - 1) * size).Take(size).Adapt<List<ReferenceResponseDto>>();
        }

        /// <summary>
        /// Sektöre göre referans arar (sayfalı).
        /// </summary>
        public async Task<List<ReferenceResponseDto>> SearchReferencesBySectorAsync(string sector, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(sector))
                throw new ArgumentException("Arama metni boş olamaz.", nameof(sector));

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var trimmedSector = sector.Trim();
            var references = await _referenceRepository.FindAsync(r =>
                !r.IsDeleted && r.Sector != null && r.Sector.Contains(trimmedSector));

            return references.OrderBy(r => r.DisplayOrder).Skip((page - 1) * size).Take(size).Adapt<List<ReferenceResponseDto>>();
        }

        #endregion
        #region STATISTICS

        /// <summary>
        /// Toplam referans sayısını döndür (silinmemiş olanlar).
        /// </summary>
        public async Task<int> GetTotalReferenceCountAsync()
        {
            var references = await _referenceRepository.FindAsync(r => !r.IsDeleted);
            return references.Count;
        }

        /// <summary>
        /// Aktif referans sayısını döndür.
        /// </summary>
        public async Task<int> GetActiveReferenceCountAsync()
        {
            var references = await _referenceRepository.FindAsync(r => r.IsActive && !r.IsDeleted);
            return references.Count;
        }

        /// <summary>
        /// Ana sayfada gösterilen referans sayısını döndür.
        /// </summary>
        public async Task<int> GetHomePageReferenceCountAsync()
        {
            var references = await _referenceRepository.FindAsync(r => r.IsShowOnHome && r.IsActive && !r.IsDeleted);
            return references.Count;
        }

        /// <summary>
        /// Belirli bir türdeki referans sayısını döndür.
        /// </summary>
        public async Task<int> GetReferenceCountByTypeAsync(ReferenceType type)
        {
            var references = await _referenceRepository.FindAsync(r => r.Type == type && !r.IsDeleted);
            return references.Count;
        }

        /// <summary>
        /// Belirli bir sektördeki referans sayısını döndür.
        /// </summary>
        public async Task<int> GetReferenceCountBySectorAsync(string sector)
        {
            if (string.IsNullOrWhiteSpace(sector))
                return 0;

            var trimmedSector = sector.Trim();
            var references = await _referenceRepository.FindAsync(r =>
                !r.IsDeleted && r.Sector != null && r.Sector.Contains(trimmedSector));

            return references.Count;
        }

        #endregion

        #region VALIDATION & CHECK

        /// <summary>
        /// Referansın var olup olmadığını kontrol eder (silinmemiş olarak).
        /// </summary>
        public async Task<bool> IsReferenceExistsAsync(int id)
        {
            var reference = await _referenceRepository.GetByIdAsync(id);
            return reference != null && !reference.IsDeleted;
        }

        /// <summary>
        /// Belirtilen isimde bir referansın var olup olmadığını kontrol eder.
        /// </summary>
        public async Task<bool> IsReferenceNameExistsAsync(string name, int? excludeReferenceId = null)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            var trimmedName = name.Trim();
            var references = await _referenceRepository.FindAsync(r => r.Name == trimmedName);

            if (excludeReferenceId.HasValue)
                return references.Any(r => r.Id != excludeReferenceId.Value);

            return references.Any();
        }

        /// <summary>
        /// Dosyanın (FileAsset) var olup olmadığını kontrol eder.
        /// </summary>
        public async Task<bool> IsFileAssetExistsAsync(int fileAssetId)
        {
            var fileAsset = await _fileAssetRepository.GetByIdAsync(fileAssetId);
            return fileAsset != null;
        }

        #endregion

        #region VALIDATION & UTILS

        /// <summary>
        /// Sayfa numarasını normalize eder (en az 1).
        /// </summary>
        private static int NormalizePageNumber(int pageNumber) => pageNumber < 1 ? 1 : pageNumber;

        /// <summary>
        /// Sayfa boyutunu normalize eder (1-100 arası).
        /// </summary>
        private static int NormalizePageSize(int pageSize) => pageSize < 1 ? 20 : (pageSize > 100 ? 100 : pageSize);

        #endregion
    }
}

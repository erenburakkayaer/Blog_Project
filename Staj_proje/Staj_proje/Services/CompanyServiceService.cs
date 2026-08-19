using Mapster;
using Staj_proje.DTO.CompanyService;
using Staj_proje.Entities;
using Staj_proje.Interfaces;
using CompanyServiceEntity = Staj_proje.Entities.CompanyService;

namespace Staj_proje.Services
{
    public class CompanyServiceService : ICompanyServiceService
    {
        private readonly ICompanyServiceRepository _companyServiceRepository;
        private readonly IGenericRepository<Company> _companyRepository;
        private readonly IGenericRepository<Category> _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CompanyServiceService(
            ICompanyServiceRepository companyServiceRepository,
            IGenericRepository<Company> companyRepository,
            IGenericRepository<Category> categoryRepository,
            IUnitOfWork unitOfWork)
        {
            _companyServiceRepository = companyServiceRepository;
            _companyRepository = companyRepository;
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Yeni bir şirket hizmeti oluşturur
        /// </summary>
        public async Task<int> CreateServiceAsync(CompanyServiceCreateDto createServiceDto)
        {
            // Şirket kontrolü
            var company = await _companyRepository.GetByIdAsync(createServiceDto.CompanyId);
            if (company == null)
                throw new InvalidOperationException($"Şirket (Company) ID: {createServiceDto.CompanyId} bulunamadı.");

            // Kategori kontrolü
            var category = await _categoryRepository.GetByIdAsync(createServiceDto.CategoryId);
            if (category == null)
                throw new InvalidOperationException($"Kategori (Category) ID: {createServiceDto.CategoryId} bulunamadı.");

            var service = new CompanyServiceEntity
            {
                CompanyId = createServiceDto.CompanyId,
                Title = createServiceDto.Title.Trim(),
                ShortDescription = createServiceDto.ShortDescription.Trim(),
                DetailedDescription = createServiceDto.DetailedDescription.Trim(),
                CategoryId = createServiceDto.CategoryId,
                IsActive = createServiceDto.IsActive,
                IsFeatured = createServiceDto.IsFeatured,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            await _companyServiceRepository.AddAsync(service);
            await _unitOfWork.CommitAsync();

            return service.Id;
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre hizmeti tüm detaylarıyla (şirket ve kategori) getirir
        /// </summary>
        public async Task<CompanyServiceDetailDto> GetServiceByIdAsync(int id)
        {
            var service = await _companyServiceRepository.GetServiceWithDetailsByIdAsync(id);

            if (service == null)
                throw new InvalidOperationException($"Hizmet ID: {id} bulunamadı.");

            return service.Adapt<CompanyServiceDetailDto>();
        }

        /// <summary>
        /// Silinmemiş tüm hizmetleri listeler
        /// </summary>
        public async Task<List<CompanyServiceListDto>> GetAllServicesAsync()
        {
            var services = await _companyServiceRepository.FindAsync(s => !s.IsDeleted);
            return services.OrderByDescending(s => s.CreatedAt).ToList().Adapt<List<CompanyServiceListDto>>();
        }

        /// <summary>
        /// Sadece aktif ve silinmemiş hizmetleri listeler
        /// </summary>
        public async Task<List<CompanyServiceListDto>> GetActiveServicesAsync()
        {
            var services = await _companyServiceRepository.FindAsync(s => !s.IsDeleted && s.IsActive);
            return services.OrderByDescending(s => s.CreatedAt).ToList().Adapt<List<CompanyServiceListDto>>();
        }

        /// <summary>
        /// Öne çıkan aktif hizmetleri detaylarıyla listeler
        /// </summary>
        public async Task<List<CompanyServiceListDto>> GetFeaturedServicesAsync()
        {
            var services = await _companyServiceRepository.GetFeaturedServicesWithDetailsAsync();
            return services.Adapt<List<CompanyServiceListDto>>();
        }

        /// <summary>
        /// Belirli bir şirkete ait tüm hizmetleri listeler
        /// </summary>
        public async Task<List<CompanyServiceListDto>> GetServicesByCompanyAsync(int companyId)
        {
            if (!await IsCompanyExistsAsync(companyId))
                throw new InvalidOperationException($"Şirket ID: {companyId} bulunamadı.");

            var services = await _companyServiceRepository.FindAsync(s => !s.IsDeleted && s.CompanyId == companyId);
            return services.OrderByDescending(s => s.CreatedAt).ToList().Adapt<List<CompanyServiceListDto>>();
        }

        /// <summary>
        /// Belirli bir kategoriye ait aktif hizmetleri listeler
        /// </summary>
        public async Task<List<CompanyServiceListDto>> GetServicesByCategoryAsync(int categoryId)
        {
            var category = await _categoryRepository.GetByIdAsync(categoryId);
            if (category == null)
                throw new InvalidOperationException($"Kategori ID: {categoryId} bulunamadı.");

            var services = await _companyServiceRepository.GetServicesByCategoryIdAsync(categoryId);
            return services.Adapt<List<CompanyServiceListDto>>();
        }

        /// <summary>
        /// Belirli bir şirkete ait aktif hizmetleri listeler
        /// </summary>
        public async Task<List<CompanyServiceListDto>> GetActiveServicesByCompanyAsync(int companyId)
        {
            if (!await IsCompanyExistsAsync(companyId))
                throw new InvalidOperationException($"Şirket ID: {companyId} bulunamadı.");

            var services = await _companyServiceRepository.GetServicesByCompanyIdAsync(companyId);
            return services.Adapt<List<CompanyServiceListDto>>();
        }

        #endregion

        #region UPDATE

        /// <summary>
        /// Hizmet bilgilerini günceller
        /// </summary>
        public async Task<bool> UpdateServiceAsync(int id, CompanyServiceUpdateDto updateServiceDto)
        {
            var service = await _companyServiceRepository.GetByIdAsync(id);

            if (service == null || service.IsDeleted)
                throw new InvalidOperationException($"Hizmet ID: {id} bulunamadı.");

            // Kategori kontrolü
            var category = await _categoryRepository.GetByIdAsync(updateServiceDto.CategoryId);
            if (category == null)
                throw new InvalidOperationException($"Kategori ID: {updateServiceDto.CategoryId} bulunamadı.");

            // Mapster ile güncelle
            updateServiceDto.Adapt(service);
            service.Title = updateServiceDto.Title.Trim();
            service.ShortDescription = updateServiceDto.ShortDescription.Trim();
            service.DetailedDescription = updateServiceDto.DetailedDescription.Trim();

            _companyServiceRepository.Update(service);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Hizmeti aktifleştirir
        /// </summary>
        public async Task<bool> ActivateServiceAsync(int id)
        {
            var service = await _companyServiceRepository.GetByIdAsync(id);

            if (service == null || service.IsDeleted)
                throw new InvalidOperationException($"Hizmet ID: {id} bulunamadı.");

            if (service.IsActive)
                throw new InvalidOperationException("Bu hizmet zaten aktif durumda.");

            service.IsActive = true;

            _companyServiceRepository.Update(service);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Hizmeti pasifleştirir
        /// </summary>
        public async Task<bool> DeactivateServiceAsync(int id)
        {
            var service = await _companyServiceRepository.GetByIdAsync(id);

            if (service == null || service.IsDeleted)
                throw new InvalidOperationException($"Hizmet ID: {id} bulunamadı.");

            if (!service.IsActive)
                throw new InvalidOperationException("Bu hizmet zaten pasif durumda.");

            service.IsActive = false;

            _companyServiceRepository.Update(service);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Hizmeti öne çıkarır (IsFeatured = true)
        /// </summary>
        public async Task<bool> FeatureServiceAsync(int id)
        {
            var service = await _companyServiceRepository.GetByIdAsync(id);

            if (service == null || service.IsDeleted)
                throw new InvalidOperationException($"Hizmet ID: {id} bulunamadı.");

            if (service.IsFeatured)
                throw new InvalidOperationException("Bu hizmet zaten öne çıkarılmış durumda.");

            service.IsFeatured = true;

            _companyServiceRepository.Update(service);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Hizmeti öne çıkarmadan kaldırır (IsFeatured = false)
        /// </summary>
        public async Task<bool> UnfeatureServiceAsync(int id)
        {
            var service = await _companyServiceRepository.GetByIdAsync(id);

            if (service == null || service.IsDeleted)
                throw new InvalidOperationException($"Hizmet ID: {id} bulunamadı.");

            if (!service.IsFeatured)
                throw new InvalidOperationException("Bu hizmet zaten öne çıkarılmamış durumda.");

            service.IsFeatured = false;

            _companyServiceRepository.Update(service);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region DELETE

        /// <summary>
        /// Hizmeti siler (Soft Delete - IsDeleted = true)
        /// </summary>
        public async Task<bool> DeleteServiceAsync(int id)
        {
            var service = await _companyServiceRepository.GetByIdAsync(id);

            if (service == null)
                throw new InvalidOperationException($"Hizmet ID: {id} bulunamadı.");

            if (service.IsDeleted)
                throw new InvalidOperationException("Bu hizmet zaten silinmiş durumda.");

            _companyServiceRepository.Remove(service); // Soft Delete
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Silinen hizmeti geri yükler (IsDeleted = false)
        /// </summary>
        public async Task<bool> RestoreServiceAsync(int id)
        {
            var service = await _companyServiceRepository.GetByIdAsync(id);

            if (service == null)
                throw new InvalidOperationException($"Hizmet ID: {id} bulunamadı.");

            if (!service.IsDeleted)
                throw new InvalidOperationException("Bu hizmet silinmemiş durumda.");

            _companyServiceRepository.Restore(service);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Hizmeti veritabanından kalıcı olarak siler (Hard Delete)
        /// </summary>
        public async Task<bool> PermanentlyDeleteServiceAsync(int id)
        {
            var service = await _companyServiceRepository.GetByIdAsync(id);

            if (service == null)
                throw new InvalidOperationException($"Hizmet ID: {id} bulunamadı.");

            _companyServiceRepository.HardDelete(service);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region SEARCH & FILTER

        /// <summary>
        /// Başlık veya açıklamalara göre aktif hizmetleri arar
        /// </summary>
        public async Task<List<CompanyServiceListDto>> SearchServicesAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                throw new ArgumentException("Arama kelimesi boş olamaz.", nameof(keyword));

            var trimmedKeyword = keyword.Trim();

            var services = await _companyServiceRepository.FindAsync(s =>
                !s.IsDeleted &&
                s.IsActive &&
                (s.Title.Contains(trimmedKeyword) ||
                 s.ShortDescription.Contains(trimmedKeyword) ||
                 s.DetailedDescription.Contains(trimmedKeyword))
            );

            return services.OrderByDescending(s => s.CreatedAt).ToList().Adapt<List<CompanyServiceListDto>>();
        }

        #endregion

        #region VALIDATION & CHECK

        /// <summary>
        /// Hizmetin var olup olmadığını ve silinmemiş olduğunu kontrol eder
        /// </summary>
        public async Task<bool> IsServiceExistsAsync(int id)
        {
            var service = await _companyServiceRepository.GetByIdAsync(id);
            return service != null && !service.IsDeleted;
        }

        /// <summary>
        /// Hizmetin aktif olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsServiceActiveAsync(int id)
        {
            var service = await _companyServiceRepository.GetByIdAsync(id);
            return service != null && !service.IsDeleted && service.IsActive;
        }

        /// <summary>
        /// Şirketin var olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsCompanyExistsAsync(int companyId)
        {
            var company = await _companyRepository.GetByIdAsync(companyId);
            return company != null && !company.IsDeleted;
        }

        #endregion
    }
}

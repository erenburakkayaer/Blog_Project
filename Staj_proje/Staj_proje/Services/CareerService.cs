using Mapster;
using Staj_proje.DTO.Career;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    public class CareerService : ICareerService
    {
        private readonly ICareerRepository _careerRepository;
        private readonly IGenericRepository<Company> _companyRepository;
        private readonly IGenericRepository<Category> _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CareerService(
            ICareerRepository careerRepository,
            IGenericRepository<Company> companyRepository,
            IGenericRepository<Category> categoryRepository,
            IUnitOfWork unitOfWork)
        {
            _careerRepository = careerRepository;
            _companyRepository = companyRepository;
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Yeni bir kariyer / iş ilanı oluşturur
        /// </summary>
        public async Task<int> CreateCareerAsync(CareerCreateDto createCareerDto)
        {
            // Şirket kontrolü
            var company = await _companyRepository.GetByIdAsync(createCareerDto.CompanyId);
            if (company == null)
                throw new InvalidOperationException($"Şirket (Company) ID: {createCareerDto.CompanyId} bulunamadı.");

            // Kategori kontrolü
            var category = await _categoryRepository.GetByIdAsync(createCareerDto.CategoryId);
            if (category == null)
                throw new InvalidOperationException($"Kategori (Category) ID: {createCareerDto.CategoryId} bulunamadı.");

            // Son başvuru tarihi geçmiş bir tarih olamaz kontrolü
            if (createCareerDto.ExpirationDate.HasValue && createCareerDto.ExpirationDate.Value <= DateTime.UtcNow)
                throw new ArgumentException("Son başvuru tarihi gelecekte bir tarih olmalıdır.");

            var career = new Career
            {
                CompanyId = createCareerDto.CompanyId,
                Title = createCareerDto.Title,
                Description = createCareerDto.Description,
                CategoryId = createCareerDto.CategoryId,
                EmploymentType = createCareerDto.EmploymentType,
                Location = createCareerDto.Location,
                ExpirationDate = createCareerDto.ExpirationDate,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            await _careerRepository.AddAsync(career);
            await _unitOfWork.CommitAsync();

            return career.Id;
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre iş ilanını tüm detaylarıyla getirir
        /// </summary>
        public async Task<CareerDetailDto> GetCareerByIdAsync(int id)
        {
            var career = await _careerRepository.GetCareerWithDetailsByIdAsync(id);

            if (career == null)
                throw new InvalidOperationException($"İlan (Career) ID: {id} bulunamadı.");

            return career.Adapt<CareerDetailDto>();
        }

        /// <summary>
        /// Silinmemiş tüm iş ilanlarını getirir
        /// </summary>
        public async Task<List<CareerListDto>> GetAllCareersAsync()
        {
            var careers = await _careerRepository.GetAllCareersWithDetailsAsync();
            return careers.Adapt<List<CareerListDto>>();
        }

        /// <summary>
        /// Aktif ve süresi dolmamış iş ilanlarını getirir
        /// </summary>
        public async Task<List<CareerListDto>> GetActiveCareersAsync()
        {
            var careers = await _careerRepository.GetActiveCareersWithDetailsAsync();
            return careers.Adapt<List<CareerListDto>>();
        }

        /// <summary>
        /// Belirli bir şirkete ait iş ilanlarını getirir
        /// </summary>
        public async Task<List<CareerListDto>> GetCareersByCompanyAsync(int companyId)
        {
            var company = await _companyRepository.GetByIdAsync(companyId);
            if (company == null)
                throw new InvalidOperationException($"Şirket (Company) ID: {companyId} bulunamadı.");

            var careers = await _careerRepository.GetCareersByCompanyIdAsync(companyId);
            return careers.Adapt<List<CareerListDto>>();
        }

        /// <summary>
        /// Belirli bir kategoriye ait iş ilanlarını getirir
        /// </summary>
        public async Task<List<CareerListDto>> GetCareersByCategoryAsync(int categoryId)
        {
            var category = await _categoryRepository.GetByIdAsync(categoryId);
            if (category == null)
                throw new InvalidOperationException($"Kategori (Category) ID: {categoryId} bulunamadı.");

            var careers = await _careerRepository.GetCareersByCategoryIdAsync(categoryId);
            return careers.Adapt<List<CareerListDto>>();
        }

        /// <summary>
        /// Çalışma türüne (Tam Zamanlı, Yarı Zamanlı, Stajyer vb.) göre ilanları filtreler
        /// </summary>
        public async Task<List<CareerListDto>> GetCareersByEmploymentTypeAsync(EmploymentType employmentType)
        {
            var careers = await _careerRepository.GetCareersByEmploymentTypeAsync(employmentType);
            return careers.Adapt<List<CareerListDto>>();
        }

        #endregion

        #region UPDATE

        /// <summary>
        /// İlan bilgilerini günceller
        /// </summary>
        public async Task<bool> UpdateCareerAsync(int id, CareerUpdateDto updateCareerDto)
        {
            var career = await _careerRepository.GetByIdAsync(id);

            if (career == null)
                throw new InvalidOperationException($"İlan (Career) ID: {id} bulunamadı.");

            // Kategori kontrolü
            var category = await _categoryRepository.GetByIdAsync(updateCareerDto.CategoryId);
            if (category == null)
                throw new InvalidOperationException($"Kategori (Category) ID: {updateCareerDto.CategoryId} bulunamadı.");

            // Mapster ile güncelle
            updateCareerDto.Adapt(career);

            _careerRepository.Update(career);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// İlanın aktiflik durumunu günceller
        /// </summary>
        public async Task<bool> UpdateCareerStatusAsync(int id, CareerStatusUpdateDto statusUpdateDto)
        {
            var career = await _careerRepository.GetByIdAsync(id);

            if (career == null)
                throw new InvalidOperationException($"İlan (Career) ID: {id} bulunamadı.");

            career.IsActive = statusUpdateDto.IsActive;

            _careerRepository.Update(career);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// İlanı aktifleştirir
        /// </summary>
        public async Task<bool> ActivateCareerAsync(int id)
        {
            var career = await _careerRepository.GetByIdAsync(id);

            if (career == null)
                throw new InvalidOperationException($"İlan (Career) ID: {id} bulunamadı.");

            if (career.IsActive)
                throw new InvalidOperationException("Bu ilan zaten aktif durumda.");

            career.IsActive = true;

            _careerRepository.Update(career);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// İlanı pasifleştirir
        /// </summary>
        public async Task<bool> DeactivateCareerAsync(int id)
        {
            var career = await _careerRepository.GetByIdAsync(id);

            if (career == null)
                throw new InvalidOperationException($"İlan (Career) ID: {id} bulunamadı.");

            if (!career.IsActive)
                throw new InvalidOperationException("Bu ilan zaten pasif durumda.");

            career.IsActive = false;

            _careerRepository.Update(career);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region DELETE

        /// <summary>
        /// İlanı siler (Soft Delete - IsDeleted = true)
        /// </summary>
        public async Task<bool> DeleteCareerAsync(int id)
        {
            var career = await _careerRepository.GetByIdAsync(id);

            if (career == null)
                throw new InvalidOperationException($"İlan (Career) ID: {id} bulunamadı.");

            if (career.IsDeleted)
                throw new InvalidOperationException("Bu ilan zaten silinmiş durumda.");

            _careerRepository.Remove(career); // Soft Delete
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Silinen ilanı geri yükler (IsDeleted = false)
        /// </summary>
        public async Task<bool> RestoreCareerAsync(int id)
        {
            var career = await _careerRepository.GetByIdAsync(id);

            if (career == null)
                throw new InvalidOperationException($"İlan (Career) ID: {id} bulunamadı.");

            if (!career.IsDeleted)
                throw new InvalidOperationException("Bu ilan silinmemiş durumda.");

            _careerRepository.Restore(career);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// İlanı veritabanından kalıcı olarak siler (Hard Delete)
        /// </summary>
        public async Task<bool> PermanentlyDeleteCareerAsync(int id)
        {
            var career = await _careerRepository.GetByIdAsync(id);

            if (career == null)
                throw new InvalidOperationException($"İlan (Career) ID: {id} bulunamadı.");

            _careerRepository.HardDelete(career);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region SEARCH & FILTER

        /// <summary>
        /// Başlık veya açıklamada geçen anahtar kelimeye göre aktif ilanları arar
        /// </summary>
        public async Task<List<CareerListDto>> SearchCareersAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                throw new ArgumentException("Arama kelimesi boş olamaz.", nameof(keyword));

            var activeCareers = await _careerRepository.GetActiveCareersWithDetailsAsync();
            var filtered = activeCareers.Where(c =>
                c.Title.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                c.Description.Contains(keyword, StringComparison.OrdinalIgnoreCase)
            ).ToList();

            return filtered.Adapt<List<CareerListDto>>();
        }

        /// <summary>
        /// Lokasyona göre aktif ilanları getirir
        /// </summary>
        public async Task<List<CareerListDto>> GetCareersByLocationAsync(string location)
        {
            if (string.IsNullOrWhiteSpace(location))
                throw new ArgumentException("Lokasyon bilgisi boş olamaz.", nameof(location));

            var activeCareers = await _careerRepository.GetActiveCareersWithDetailsAsync();
            var filtered = activeCareers.Where(c =>
                c.Location.Contains(location, StringComparison.OrdinalIgnoreCase)
            ).ToList();

            return filtered.Adapt<List<CareerListDto>>();
        }

        /// <summary>
        /// Son başvuru tarihi geçmiş ilanları listeler
        /// </summary>
        public async Task<List<CareerListDto>> GetExpiredCareersAsync()
        {
            var expiredCareers = await _careerRepository.GetExpiredCareersWithDetailsAsync();
            return expiredCareers.Adapt<List<CareerListDto>>();
        }

        #endregion

        #region VALIDATION & CHECK

        /// <summary>
        /// İlanın var olup olmadığını ve silinmemiş olduğunu kontrol eder
        /// </summary>
        public async Task<bool> IsCareerExistsAsync(int id)
        {
            var career = await _careerRepository.GetByIdAsync(id);
            return career != null && !career.IsDeleted;
        }

        /// <summary>
        /// İlanın son başvuru tarihinin geçip geçmediğini kontrol eder
        /// </summary>
        public async Task<bool> IsCareerExpiredAsync(int id)
        {
            var career = await _careerRepository.GetByIdAsync(id);
            if (career == null || career.IsDeleted)
                throw new InvalidOperationException($"İlan (Career) ID: {id} bulunamadı.");

            return career.ExpirationDate.HasValue && career.ExpirationDate.Value <= DateTime.UtcNow;
        }

        /// <summary>
        /// İlanın aktif olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsCareerActiveAsync(int id)
        {
            var career = await _careerRepository.GetByIdAsync(id);
            if (career == null || career.IsDeleted)
                throw new InvalidOperationException($"İlan (Career) ID: {id} bulunamadı.");

            var isExpired = career.ExpirationDate.HasValue && career.ExpirationDate.Value <= DateTime.UtcNow;
            return career.IsActive && !isExpired;
        }

        #endregion
    }
}

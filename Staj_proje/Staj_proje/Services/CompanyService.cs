using Mapster;
using Staj_proje.DTO.Company;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IGenericRepository<FileAsset> _fileAssetRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CompanyService(
            ICompanyRepository companyRepository,
            IGenericRepository<FileAsset> fileAssetRepository,
            IUnitOfWork unitOfWork)
        {
            _companyRepository = companyRepository;
            _fileAssetRepository = fileAssetRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Yeni bir şirket oluşturur
        /// </summary>
        public async Task<int> CreateCompanyAsync(CompanyCreateDto createCompanyDto)
        {
            if (string.IsNullOrWhiteSpace(createCompanyDto.Name))
                throw new ArgumentException("Şirket adı boş olamaz.", nameof(createCompanyDto.Name));

            // Aynı isimde şirket kontrolü
            if (await IsCompanyNameExistsAsync(createCompanyDto.Name))
                throw new InvalidOperationException($"'{createCompanyDto.Name}' isimli bir şirket zaten mevcut.");

            // Aynı e-posta kontrolü
            if (await IsCompanyEmailExistsAsync(createCompanyDto.Email))
                throw new InvalidOperationException($"'{createCompanyDto.Email}' e-posta adresine sahip bir şirket zaten mevcut.");

            // Logo dosyasını kontrol et (varsa)
            if (createCompanyDto.LogoFileAssetId.HasValue)
            {
                var logo = await _fileAssetRepository.GetByIdAsync(createCompanyDto.LogoFileAssetId.Value);
                if (logo == null)
                    throw new InvalidOperationException($"Logo dosyası (FileAsset) ID: {createCompanyDto.LogoFileAssetId} bulunamadı.");
            }

            var company = new Company
            {
                Name = createCompanyDto.Name.Trim(),
                Tagline = createCompanyDto.Tagline,
                Description = createCompanyDto.Description,
                LogoFileAssetId = createCompanyDto.LogoFileAssetId,
                Email = createCompanyDto.Email.Trim().ToLower(),
                Phone = createCompanyDto.Phone.Trim(),
                Location = createCompanyDto.Location.Trim(),
                IsDeleted = false
            };

            await _companyRepository.AddAsync(company);
            await _unitOfWork.CommitAsync();

            return company.Id;
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre şirketi tüm detaylarıyla (çalışanlar, ilanlar, hizmetler, galeri) getirir
        /// </summary>
        public async Task<CompanyDetailDto> GetCompanyByIdAsync(int id)
        {
            var company = await _companyRepository.GetCompanyWithDetailsByIdAsync(id);

            if (company == null)
                throw new InvalidOperationException($"Şirket (Company) ID: {id} bulunamadı.");

            return company.Adapt<CompanyDetailDto>();
        }

        /// <summary>
        /// Silinmemiş tüm şirketleri listeler
        /// </summary>
        public async Task<List<CompanyListDto>> GetAllCompaniesAsync()
        {
            var companies = await _companyRepository.GetAllCompaniesWithDetailsAsync();
            return companies.Adapt<List<CompanyListDto>>();
        }

        /// <summary>
        /// Aktif iş ilanı olan şirketleri listeler
        /// </summary>
        public async Task<List<CompanyListDto>> GetCompaniesWithActiveCareerAsync()
        {
            var companies = await _companyRepository.GetCompaniesWithActiveCareerAsync();
            return companies.Adapt<List<CompanyListDto>>();
        }

        #endregion

        #region UPDATE

        /// <summary>
        /// Şirket bilgilerini günceller
        /// </summary>
        public async Task<bool> UpdateCompanyAsync(int id, CompanyUpdateDto updateCompanyDto)
        {
            if (string.IsNullOrWhiteSpace(updateCompanyDto.Name))
                throw new ArgumentException("Şirket adı boş olamaz.", nameof(updateCompanyDto.Name));

            var company = await _companyRepository.GetByIdAsync(id);

            if (company == null || company.IsDeleted)
                throw new InvalidOperationException($"Şirket (Company) ID: {id} bulunamadı.");

            // Farklı bir şirkette aynı isim var mı kontrolü
            var trimmedName = updateCompanyDto.Name.Trim().ToLower();
            var existingWithName = (await _companyRepository.FindAsync(c =>
                !c.IsDeleted &&
                c.Id != id &&
                c.Name.ToLower() == trimmedName
            )).FirstOrDefault();

            if (existingWithName != null)
                throw new InvalidOperationException($"'{updateCompanyDto.Name}' isimli başka bir şirket zaten mevcut.");

            // Farklı bir şirkette aynı e-posta var mı kontrolü
            var trimmedEmail = updateCompanyDto.Email.Trim().ToLower();
            var existingWithEmail = (await _companyRepository.FindAsync(c =>
                !c.IsDeleted &&
                c.Id != id &&
                c.Email.ToLower() == trimmedEmail
            )).FirstOrDefault();

            if (existingWithEmail != null)
                throw new InvalidOperationException($"'{updateCompanyDto.Email}' e-posta adresine sahip başka bir şirket zaten mevcut.");

            // Logo dosyasını kontrol et (varsa)
            if (updateCompanyDto.LogoFileAssetId.HasValue)
            {
                var logo = await _fileAssetRepository.GetByIdAsync(updateCompanyDto.LogoFileAssetId.Value);
                if (logo == null)
                    throw new InvalidOperationException($"Logo dosyası (FileAsset) ID: {updateCompanyDto.LogoFileAssetId} bulunamadı.");
            }

            // Mapster ile güncelle
            updateCompanyDto.Adapt(company);
            company.Name = updateCompanyDto.Name.Trim();
            company.Email = trimmedEmail;
            company.Phone = updateCompanyDto.Phone.Trim();
            company.Location = updateCompanyDto.Location.Trim();

            _companyRepository.Update(company);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Şirketin logo görselini günceller
        /// </summary>
        public async Task<bool> UpdateCompanyLogoAsync(int id, int logoFileAssetId)
        {
            var company = await _companyRepository.GetByIdAsync(id);

            if (company == null || company.IsDeleted)
                throw new InvalidOperationException($"Şirket (Company) ID: {id} bulunamadı.");

            var logo = await _fileAssetRepository.GetByIdAsync(logoFileAssetId);
            if (logo == null)
                throw new InvalidOperationException($"Logo dosyası (FileAsset) ID: {logoFileAssetId} bulunamadı.");

            company.LogoFileAssetId = logoFileAssetId;

            _companyRepository.Update(company);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region DELETE

        /// <summary>
        /// Şirketi siler (Soft Delete - IsDeleted = true)
        /// </summary>
        public async Task<bool> DeleteCompanyAsync(int id)
        {
            var company = await _companyRepository.GetByIdAsync(id);

            if (company == null)
                throw new InvalidOperationException($"Şirket (Company) ID: {id} bulunamadı.");

            if (company.IsDeleted)
                throw new InvalidOperationException("Bu şirket zaten silinmiş durumda.");

            _companyRepository.Remove(company); // Soft Delete
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Silinen şirketi geri yükler (IsDeleted = false)
        /// </summary>
        public async Task<bool> RestoreCompanyAsync(int id)
        {
            var company = await _companyRepository.GetByIdAsync(id);

            if (company == null)
                throw new InvalidOperationException($"Şirket (Company) ID: {id} bulunamadı.");

            if (!company.IsDeleted)
                throw new InvalidOperationException("Bu şirket silinmemiş durumda.");

            _companyRepository.Restore(company);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Şirketi veritabanından kalıcı olarak siler (Hard Delete)
        /// </summary>
        public async Task<bool> PermanentlyDeleteCompanyAsync(int id)
        {
            var company = await _companyRepository.GetByIdAsync(id);

            if (company == null)
                throw new InvalidOperationException($"Şirket (Company) ID: {id} bulunamadı.");

            _companyRepository.HardDelete(company);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region SEARCH & FILTER

        /// <summary>
        /// İsim, slogan veya açıklamada geçen anahtar kelimeye göre şirket arar
        /// </summary>
        public async Task<List<CompanyListDto>> SearchCompaniesAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                throw new ArgumentException("Arama kelimesi boş olamaz.", nameof(keyword));

            var companies = await _companyRepository.GetAllCompaniesWithDetailsAsync();
            var filtered = companies.Where(c =>
                c.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                c.Description.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                (c.Tagline != null && c.Tagline.Contains(keyword, StringComparison.OrdinalIgnoreCase))
            ).ToList();

            return filtered.Adapt<List<CompanyListDto>>();
        }

        /// <summary>
        /// Lokasyona göre şirketleri filtreler
        /// </summary>
        public async Task<List<CompanyListDto>> GetCompaniesByLocationAsync(string location)
        {
            if (string.IsNullOrWhiteSpace(location))
                throw new ArgumentException("Konum bilgisi boş olamaz.", nameof(location));

            var companies = await _companyRepository.GetAllCompaniesWithDetailsAsync();
            var filtered = companies.Where(c =>
                c.Location.Contains(location, StringComparison.OrdinalIgnoreCase)
            ).ToList();

            return filtered.Adapt<List<CompanyListDto>>();
        }

        #endregion

        #region VALIDATION & CHECK

        /// <summary>
        /// Şirketin var olup olmadığını ve silinmemiş olduğunu kontrol eder
        /// </summary>
        public async Task<bool> IsCompanyExistsAsync(int id)
        {
            var company = await _companyRepository.GetByIdAsync(id);
            return company != null && !company.IsDeleted;
        }

        /// <summary>
        /// Aynı isimde silinmemiş bir şirket olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsCompanyNameExistsAsync(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;

            var trimmedName = name.Trim().ToLower();
            var companies = await _companyRepository.FindAsync(c =>
                !c.IsDeleted &&
                c.Name.ToLower() == trimmedName
            );

            return companies.Any();
        }

        /// <summary>
        /// Aynı e-postaya sahip silinmemiş bir şirket olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsCompanyEmailExistsAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            var trimmedEmail = email.Trim().ToLower();
            var companies = await _companyRepository.FindAsync(c =>
                !c.IsDeleted &&
                c.Email.ToLower() == trimmedEmail
            );

            return companies.Any();
        }

        #endregion
    }
}

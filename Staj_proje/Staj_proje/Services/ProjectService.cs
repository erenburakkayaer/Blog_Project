using Staj_proje.Entities;
using Staj_proje.Interfaces;
using Staj_proje.Services.Interfaces;
using System.Text.RegularExpressions;

namespace Staj_proje.Services
{
    /// <summary>
    /// Proje (Project) işlemlerini yöneten servis sınıfı.
    /// IProjectService arayüzün tüm üyelerini implemente eder.
    /// </summary>
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IGenericRepository<Category> _categoryRepository;
        private readonly IGenericRepository<FileAsset> _fileAssetRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ProjectService(
            IProjectRepository projectRepository,
            IGenericRepository<Category> categoryRepository,
            IGenericRepository<FileAsset> fileAssetRepository,
            IUnitOfWork unitOfWork)
        {
            _projectRepository = projectRepository;
            _categoryRepository = categoryRepository;
            _fileAssetRepository = fileAssetRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Yeni bir proje oluştur ve oluşturulan projenin ID'sini döndür.
        /// </summary>
        public async Task<int> CreateProjectAsync(Project project)
        {
            if (string.IsNullOrWhiteSpace(project.Title))
                throw new ArgumentException("Proje başlığı zorunludur.", nameof(project.Title));

            if (string.IsNullOrWhiteSpace(project.ShortDescription))
                throw new ArgumentException("Proje kısa açıklaması zorunludur.", nameof(project.ShortDescription));

            if (string.IsNullOrWhiteSpace(project.Description))
                throw new ArgumentException("Proje açıklaması zorunludur.", nameof(project.Description));

            // Kategori kontrolü
            if (!await IsCategoryExistsAsync(project.CategoryId))
                throw new InvalidOperationException($"Kategori ID: {project.CategoryId} bulunamadı.");

            // Slug belirleme ve benzersizlik kontrolü
            string slug;
            if (!string.IsNullOrWhiteSpace(project.Slug))
            {
                slug = GenerateSlug(project.Slug);
                if (!await IsSlugUniqueAsync(slug))
                    throw new InvalidOperationException($"'{slug}' URL yolu (Slug) zaten kullanılıyor.");
            }
            else
            {
                slug = await GenerateUniqueSlugAsync(project.Title);
            }

            project.Slug = slug;
            project.CreatedAt = DateTime.UtcNow;
            project.IsDeleted = false;

            await _projectRepository.AddAsync(project);
            await _unitOfWork.CommitAsync();

            return project.Id;
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre projeyi tüm detaylarıyla getir.
        /// </summary>
        public async Task<Project> GetProjectByIdAsync(int id)
        {
            var project = await _projectRepository.GetProjectWithDetailsByIdAsync(id);

            if (project == null)
                throw new InvalidOperationException($"Proje ID: {id} bulunamadı.");

            return project;
        }

        /// <summary>
        /// URL Slug'a göre projeyi tüm detaylarıyla getir.
        /// </summary>
        public async Task<Project> GetProjectBySlugAsync(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
                throw new ArgumentException("Slug boş olamaz.", nameof(slug));

            var formattedSlug = GenerateSlug(slug);
            var project = await _projectRepository.GetBySlugWithDetailsAsync(formattedSlug);

            if (project == null)
                throw new InvalidOperationException($"'{formattedSlug}' URL yoluna sahip proje bulunamadı.");

            return project;
        }

        /// <summary>
        /// Tüm projeleri (silinmemiş olanları) sayfalı olarak listeler.
        /// </summary>
        public async Task<List<Project>> GetAllProjectsAsync(int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var projects = await _projectRepository.FindAsync(p => !p.IsDeleted);
            return projects.OrderByDescending(p => p.CreatedAt).Skip((page - 1) * size).Take(size).ToList();
        }

        /// <summary>
        /// Sadece aktif (IsActive = true) ve silinmemiş projeleri sayfalı olarak listeler.
        /// </summary>
        public async Task<List<Project>> GetActiveProjectsAsync(int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var projects = await _projectRepository.FindAsync(p => p.IsActive && !p.IsDeleted);
            return projects.OrderByDescending(p => p.CreatedAt).Skip((page - 1) * size).Take(size).ToList();
        }

        /// <summary>
        /// Öne çıkan (IsFeatured = true) aktif projeleri sayfalı olarak listeler.
        /// </summary>
        public async Task<List<Project>> GetFeaturedProjectsAsync(int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var projects = await _projectRepository.FindAsync(p => p.IsFeatured && p.IsActive && !p.IsDeleted);
            return projects.OrderBy(p => p.DisplayOrder).Skip((page - 1) * size).Take(size).ToList();
        }

        /// <summary>
        /// Kategoriye göre projeleri sayfalı olarak listeler.
        /// </summary>
        public async Task<List<Project>> GetProjectsByCategoryAsync(int categoryId, int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var projects = await _projectRepository.FindAsync(p => p.CategoryId == categoryId && !p.IsDeleted);
            return projects.OrderByDescending(p => p.CreatedAt).Skip((page - 1) * size).Take(size).ToList();
        }

        /// <summary>
        /// Kategoriye göre aktif projeleri sayfalı olarak listeler.
        /// </summary>
        public async Task<List<Project>> GetActiveProjectsByCategoryAsync(int categoryId, int pageNumber = 1, int pageSize = 20)
        {
            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var projects = await _projectRepository.GetProjectsByCategoryIdAsync(categoryId);
            return projects.Skip((page - 1) * size).Take(size).ToList();
        }

        /// <summary>
        /// Kullanılan teknolojiye göre projeleri sayfalı olarak listeler.
        /// </summary>
        public async Task<List<Project>> GetProjectsByTechnologyAsync(string technology, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(technology))
                throw new ArgumentException("Teknoloji adı boş olamaz.", nameof(technology));

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var trimmedTechnology = technology.Trim();
            var projects = await _projectRepository.FindAsync(p =>
                !p.IsDeleted && p.UsedTechnologies != null && p.UsedTechnologies.Contains(trimmedTechnology));

            return projects.OrderByDescending(p => p.CreatedAt).Skip((page - 1) * size).Take(size).ToList();
        }

        /// <summary>
        /// Müşteri adına göre projeleri sayfalı olarak listeler.
        /// </summary>
        public async Task<List<Project>> GetProjectsByClientNameAsync(string clientName, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(clientName))
                throw new ArgumentException("Müşteri adı boş olamaz.", nameof(clientName));

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var trimmedName = clientName.Trim();
            var projects = await _projectRepository.FindAsync(p =>
                !p.IsDeleted && p.ClientName != null && p.ClientName.Contains(trimmedName));

            return projects.OrderByDescending(p => p.CreatedAt).Skip((page - 1) * size).Take(size).ToList();
        }

        /// <summary>
        /// Tamamlanma tarihi aralığına göre projeleri sayfalı olarak listeler.
        /// </summary>
        public async Task<List<Project>> GetProjectsByCompletionDateRangeAsync(DateTime startDate, DateTime endDate,
            int pageNumber = 1, int pageSize = 20)
        {
            if (startDate > endDate)
                throw new ArgumentException("Başlangıç tarihi bitiş tarihinden sonra olamaz.");

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var projects = await _projectRepository.FindAsync(p =>
                !p.IsDeleted &&
                p.CompletionDate.HasValue &&
                p.CompletionDate.Value >= startDate &&
                p.CompletionDate.Value <= endDate);

            return projects.OrderByDescending(p => p.CompletionDate).Skip((page - 1) * size).Take(size).ToList();
        }

        #endregion
        #region UPDATE

        /// <summary>
        /// Proje bilgilerini günceller.
        /// </summary>
        public async Task<bool> UpdateProjectAsync(int id, Project project)
        {
            var existing = await _projectRepository.GetByIdAsync(id);

            if (existing == null || existing.IsDeleted)
                throw new InvalidOperationException($"Proje ID: {id} bulunamadı.");

            if (string.IsNullOrWhiteSpace(project.Title))
                throw new ArgumentException("Proje başlığı zorunludur.", nameof(project.Title));

            // Kategori kontrolü
            if (!await IsCategoryExistsAsync(project.CategoryId))
                throw new InvalidOperationException($"Kategori ID: {project.CategoryId} bulunamadı.");

            // Slug belirleme ve benzersizlik kontrolü
            string slug;
            if (!string.IsNullOrWhiteSpace(project.Slug))
            {
                slug = GenerateSlug(project.Slug);
                if (!await IsSlugUniqueAsync(slug, id))
                    throw new InvalidOperationException($"'{slug}' URL yolu (Slug) başka bir proje tarafından kullanılıyor.");
            }
            else
            {
                slug = await GenerateUniqueSlugAsync(project.Title, id);
            }

            existing.Title = project.Title;
            existing.Slug = slug;
            existing.ShortDescription = project.ShortDescription;
            existing.Description = project.Description;
            existing.ClientName = project.ClientName;
            existing.UsedTechnologies = project.UsedTechnologies;
            existing.CompletionDate = project.CompletionDate;
            existing.CategoryId = project.CategoryId;
            existing.ProjectUrl = project.ProjectUrl;
            existing.IsFeatured = project.IsFeatured;
            existing.IsActive = project.IsActive;
            existing.DisplayOrder = project.DisplayOrder;

            _projectRepository.Update(existing);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Projeyi aktif yapar (IsActive = true).
        /// </summary>
        public async Task<bool> ActivateProjectAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);

            if (project == null || project.IsDeleted)
                throw new InvalidOperationException($"Proje ID: {id} bulunamadı.");

            project.IsActive = true;

            _projectRepository.Update(project);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Projeyi pasif yapar (IsActive = false).
        /// </summary>
        public async Task<bool> DeactivateProjectAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);

            if (project == null || project.IsDeleted)
                throw new InvalidOperationException($"Proje ID: {id} bulunamadı.");

            project.IsActive = false;

            _projectRepository.Update(project);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Projeyi öne çıkarır (IsFeatured = true).
        /// </summary>
        public async Task<bool> FeatureProjectAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);

            if (project == null || project.IsDeleted)
                throw new InvalidOperationException($"Proje ID: {id} bulunamadı.");

            project.IsFeatured = true;

            _projectRepository.Update(project);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Projenin öne çıkarılma durumunu kaldır (IsFeatured = false).
        /// </summary>
        public async Task<bool> UnfeatureProjectAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);

            if (project == null || project.IsDeleted)
                throw new InvalidOperationException($"Proje ID: {id} bulunamadı.");

            project.IsFeatured = false;

            _projectRepository.Update(project);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Projenin sıralama sırasını günceller.
        /// </summary>
        public async Task<bool> UpdateDisplayOrderAsync(int id, int displayOrder)
        {
            var project = await _projectRepository.GetByIdAsync(id);

            if (project == null || project.IsDeleted)
                throw new InvalidOperationException($"Proje ID: {id} bulunamadı.");

            project.DisplayOrder = displayOrder;

            _projectRepository.Update(project);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Projenin kapak görselini (CoverImageUrl) günceller.
        /// </summary>
        public async Task<bool> UpdateCoverImageAsync(int id, int fileAssetId)
        {
            var project = await _projectRepository.GetByIdAsync(id);

            if (project == null || project.IsDeleted)
                throw new InvalidOperationException($"Proje ID: {id} bulunamadı.");

            if (!await IsFileAssetExistsAsync(fileAssetId))
                throw new InvalidOperationException($"Dosya (FileAsset) ID: {fileAssetId} bulunamadı.");

            var fileAsset = await _fileAssetRepository.GetByIdAsync(fileAssetId);
            project.CoverImageUrl = fileAsset!;

            _projectRepository.Update(project);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion
        #region DELETE

        /// <summary>
        /// Projeyi siler (Soft Delete - IsDeleted = true).
        /// </summary>
        public async Task<bool> DeleteProjectAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);

            if (project == null)
                throw new InvalidOperationException($"Proje ID: {id} bulunamadı.");

            if (project.IsDeleted)
                throw new InvalidOperationException("Bu proje zaten silinmiş durumda.");

            _projectRepository.Remove(project); // Soft Delete
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Silinen projeyi geri yükler (IsDeleted = false).
        /// </summary>
        public async Task<bool> RestoreProjectAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);

            if (project == null)
                throw new InvalidOperationException($"Proje ID: {id} bulunamadı.");

            if (!project.IsDeleted)
                throw new InvalidOperationException("Bu proje silinmemiş durumda.");

            _projectRepository.Restore(project);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Projeyi veritabanından kalıcı olarak siler (Hard Delete).
        /// </summary>
        public async Task<bool> PermanentlyDeleteProjectAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);

            if (project == null)
                throw new InvalidOperationException($"Proje ID: {id} bulunamadı.");

            _projectRepository.HardDelete(project);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region SEARCH & FILTER

        /// <summary>
        /// Başlığa göre proje arar (sayfalı).
        /// </summary>
        public async Task<List<Project>> SearchProjectsByTitleAsync(string title, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Arama metni boş olamaz.", nameof(title));

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var trimmedTitle = title.Trim();
            var projects = await _projectRepository.FindAsync(p =>
                !p.IsDeleted && p.Title.Contains(trimmedTitle));

            return projects.OrderByDescending(p => p.CreatedAt).Skip((page - 1) * size).Take(size).ToList();
        }

        /// <summary>
        /// Açıklamada anahtar kelimeye göre proje arar (sayfalı).
        /// </summary>
        public async Task<List<Project>> SearchProjectsByDescriptionAsync(string keyword, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                throw new ArgumentException("Arama metni boş olamaz.", nameof(keyword));

            var page = NormalizePageNumber(pageNumber);
            var size = NormalizePageSize(pageSize);

            var trimmedKeyword = keyword.Trim();
            var projects = await _projectRepository.FindAsync(p =>
                !p.IsDeleted &&
                (p.Description.Contains(trimmedKeyword) || p.ShortDescription.Contains(trimmedKeyword)));

            return projects.OrderByDescending(p => p.CreatedAt).Skip((page - 1) * size).Take(size).ToList();
        }

        #endregion
        #region STATISTICS

        /// <summary>
        /// Toplam proje sayısını döndür (silinmemiş olanlar).
        /// </summary>
        public async Task<int> GetTotalProjectCountAsync()
        {
            var projects = await _projectRepository.FindAsync(p => !p.IsDeleted);
            return projects.Count;
        }

        /// <summary>
        /// Aktif proje sayısını döndür.
        /// </summary>
        public async Task<int> GetActiveProjectCountAsync()
        {
            var projects = await _projectRepository.FindAsync(p => p.IsActive && !p.IsDeleted);
            return projects.Count;
        }

        /// <summary>
        /// Öne çıkan proje sayısını döndür.
        /// </summary>
        public async Task<int> GetFeaturedProjectCountAsync()
        {
            var projects = await _projectRepository.FindAsync(p => p.IsFeatured && p.IsActive && !p.IsDeleted);
            return projects.Count;
        }

        /// <summary>
        /// Belirli bir kategoriye ait proje sayısını döndür.
        /// </summary>
        public async Task<int> GetProjectCountByCategoryAsync(int categoryId)
        {
            var projects = await _projectRepository.FindAsync(p => p.CategoryId == categoryId && !p.IsDeleted);
            return projects.Count;
        }

        #endregion

        #region VALIDATION & CHECK

        /// <summary>
        /// Projenin var olup olmadığını kontrol eder (silinmemiş olarak).
        /// </summary>
        public async Task<bool> IsProjectExistsAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            return project != null && !project.IsDeleted;
        }

        /// <summary>
        /// Belirtilen slug'a sahip bir projenin var olup olmadığını kontrol eder.
        /// </summary>
        public async Task<bool> IsProjectExistsBySlugAsync(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
                return false;

            var formattedSlug = GenerateSlug(slug);
            var projects = await _projectRepository.FindAsync(p => p.Slug == formattedSlug && !p.IsDeleted);
            return projects.Any();
        }

        /// <summary>
        /// Belirtilen slug'ın benzersiz olup olmadığını kontrol eder.
        /// </summary>
        public async Task<bool> IsSlugUniqueAsync(string slug, int? excludeProjectId = null)
        {
            if (string.IsNullOrWhiteSpace(slug))
                return false;

            var formattedSlug = GenerateSlug(slug);
            var projects = await _projectRepository.FindAsync(p => p.Slug == formattedSlug);

            if (excludeProjectId.HasValue)
                return !projects.Any(p => p.Id != excludeProjectId.Value);

            return !projects.Any();
        }

        /// <summary>
        /// Kategorinin var olup olmadığını kontrol eder.
        /// </summary>
        public async Task<bool> IsCategoryExistsAsync(int categoryId)
        {
            var category = await _categoryRepository.GetByIdAsync(categoryId);
            return category != null;
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
        /// Başlıktan benzersiz bir URL slug oluştur.
        /// </summary>
        private async Task<string> GenerateUniqueSlugAsync(string title, int? currentId = null)
        {
            var baseSlug = GenerateSlug(title);
            if (string.IsNullOrEmpty(baseSlug))
                baseSlug = "project";

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

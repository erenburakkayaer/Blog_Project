using Mapster;
using Staj_proje.DTO.Blog;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    public class BlogService : IBlogService
    {
        private readonly IBlogRepository _blogRepository;
        private readonly IGenericRepository<Category> _categoryRepository;
        private readonly IGenericRepository<User> _userRepository;
        private readonly IGenericRepository<FileAsset> _fileAssetRepository;
        private readonly IUnitOfWork _unitOfWork;

        public BlogService(
            IBlogRepository blogRepository,
            IGenericRepository<Category> categoryRepository,
            IGenericRepository<User> userRepository,
            IGenericRepository<FileAsset> fileAssetRepository,
            IUnitOfWork unitOfWork)
        {
            _blogRepository = blogRepository;
            _categoryRepository = categoryRepository;
            _userRepository = userRepository;
            _fileAssetRepository = fileAssetRepository;
            _unitOfWork = unitOfWork;
        }

        #region CREATE

        /// <summary>
        /// Yeni bir blog yazısı oluşturur
        /// </summary>
        public async Task<int> CreateBlogAsync(BlogCreateDto createBlogDto, int authorId)
        {
            // Yazarı kontrol et
            var author = await _userRepository.GetByIdAsync(authorId);
            if (author == null)
                throw new InvalidOperationException($"Yazar ID: {authorId} bulunamadı.");

            // Kategoriyi kontrol et
            var category = await _categoryRepository.GetByIdAsync(createBlogDto.CategoryId);
            if (category == null)
                throw new InvalidOperationException($"Kategori ID: {createBlogDto.CategoryId} bulunamadı.");

            // Kapak görselini kontrol et (varsa)
            if (createBlogDto.CoverImageAssetId.HasValue)
            {
                var coverImage = await _fileAssetRepository.GetByIdAsync(createBlogDto.CoverImageAssetId.Value);
                if (coverImage == null)
                    throw new InvalidOperationException($"Dosya (FileAsset) ID: {createBlogDto.CoverImageAssetId} bulunamadı.");
            }

            // Blog nesnesi oluştur
            var blog = new Blog
            {
                Title = createBlogDto.Title,
                Content = createBlogDto.Content,
                AuthorId = authorId,
                CategoryId = createBlogDto.CategoryId,
                CoverImageAssetId = createBlogDto.CoverImageAssetId,
                IsPublished = createBlogDto.IsPublished,
                CreatedAt = DateTime.UtcNow
            };

            await _blogRepository.AddAsync(blog);
            await _unitOfWork.CommitAsync();

            return blog.Id;
        }

        #endregion

        #region READ

        /// <summary>
        /// ID'ye göre blogu tüm detaylarıyla getirir
        /// </summary>
        public async Task<BlogResponseDto> GetBlogByIdAsync(int id)
        {
            var blog = await _blogRepository.GetBlogWithDetailsByIdAsync(id);

            if (blog == null)
                throw new InvalidOperationException($"Blog ID: {id} bulunamadı.");

            var result = blog.Adapt<BlogResponseDto>();
            return result;
        }

        /// <summary>
        /// Tüm blogları (silinmemiş olanları) listeler
        /// </summary>
        public async Task<List<BlogListDto>> GetAllBlogsAsync()
        {
            var blogs = await _blogRepository.GetBlogsWithDetailsAsync();
            var result = blogs.Adapt<List<BlogListDto>>();
            return result;
        }

        /// <summary>
        /// Sadece yayınlanmış blogları getirir
        /// </summary>
        public async Task<List<BlogListDto>> GetPublishedBlogsAsync()
        {
            var blogs = await _blogRepository.GetPublishedBlogsAsync();
            var result = blogs.Adapt<List<BlogListDto>>();
            return result;
        }

        /// <summary>
        /// Belirli bir yazarın bloglarını getirir
        /// </summary>
        public async Task<List<BlogListDto>> GetBlogsByAuthorAsync(int authorId)
        {
            // Yazarı kontrol et
            var author = await _userRepository.GetByIdAsync(authorId);
            if (author == null)
                throw new InvalidOperationException($"Yazar ID: {authorId} bulunamadı.");

            var blogs = await _blogRepository.FindAsync(b => b.AuthorId == authorId && !b.IsDeleted);
            var result = blogs.Adapt<List<BlogListDto>>();
            return result;
        }

        /// <summary>
        /// Belirli bir kategoriye ait blogları getirir
        /// </summary>
        public async Task<List<BlogListDto>> GetBlogsByCategoryAsync(int categoryId)
        {
            // Kategoriyi kontrol et
            var category = await _categoryRepository.GetByIdAsync(categoryId);
            if (category == null)
                throw new InvalidOperationException($"Kategori ID: {categoryId} bulunamadı.");

            var blogs = await _blogRepository.GetBlogsByCategoryIdAsync(categoryId);
            var result = blogs.Adapt<List<BlogListDto>>();
            return result;
        }

        #endregion

        #region UPDATE

        /// <summary>
        /// Blog bilgilerini günceller
        /// </summary>
        public async Task<bool> UpdateBlogAsync(int id, BlogUpdateDto updateBlogDto, int authorId)
        {
            var blog = await _blogRepository.GetByIdAsync(id);

            if (blog == null)
                throw new InvalidOperationException($"Blog ID: {id} bulunamadı.");

            // Yetki kontrolü: Sadece yazar veya admin güncelleyebilir
            if (!await IsUserBlogOwnerAsync(id, authorId))
                throw new UnauthorizedAccessException("Bu blogu düzenleme yetkiniz yok.");

            // Kategoriyi kontrol et
            var category = await _categoryRepository.GetByIdAsync(updateBlogDto.CategoryId);
            if (category == null)
                throw new InvalidOperationException($"Kategori ID: {updateBlogDto.CategoryId} bulunamadı.");

            // Kapak görselini kontrol et (varsa)
            if (updateBlogDto.CoverImageAssetId.HasValue)
            {
                var coverImage = await _fileAssetRepository.GetByIdAsync(updateBlogDto.CoverImageAssetId.Value);
                if (coverImage == null)
                    throw new InvalidOperationException($"Dosya (FileAsset) ID: {updateBlogDto.CoverImageAssetId} bulunamadı.");
            }

            // Mapster ile güncelle
            updateBlogDto.Adapt(blog);

            _blogRepository.Update(blog);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Blogu yayınlar (IsPublished = true)
        /// </summary>
        public async Task<bool> PublishBlogAsync(int id, int authorId)
        {
            var blog = await _blogRepository.GetByIdAsync(id);

            if (blog == null)
                throw new InvalidOperationException($"Blog ID: {id} bulunamadı.");

            // Yetki kontrolü
            if (!await IsUserBlogOwnerAsync(id, authorId))
                throw new UnauthorizedAccessException("Bu blogu yayınlama yetkiniz yok.");

            if (blog.IsPublished)
                throw new InvalidOperationException("Bu blog zaten yayında.");

            blog.IsPublished = true;

            _blogRepository.Update(blog);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Blogu taslak durumuna alır (IsPublished = false)
        /// </summary>
        public async Task<bool> UnpublishBlogAsync(int id, int authorId)
        {
            var blog = await _blogRepository.GetByIdAsync(id);

            if (blog == null)
                throw new InvalidOperationException($"Blog ID: {id} bulunamadı.");

            // Yetki kontrolü
            if (!await IsUserBlogOwnerAsync(id, authorId))
                throw new UnauthorizedAccessException("Bu blogu taslak yapma yetkiniz yok.");

            if (!blog.IsPublished)
                throw new InvalidOperationException("Bu blog zaten taslak durumunda.");

            blog.IsPublished = false;

            _blogRepository.Update(blog);
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region DELETE

        /// <summary>
        /// Blogu siler (Soft Delete - IsDeleted = true)
        /// </summary>
        public async Task<bool> DeleteBlogAsync(int id, int authorId)
        {
            var blog = await _blogRepository.GetByIdAsync(id);

            if (blog == null)
                throw new InvalidOperationException($"Blog ID: {id} bulunamadı.");

            // Yetki kontrolü
            if (!await IsUserBlogOwnerAsync(id, authorId))
                throw new UnauthorizedAccessException("Bu blogu silme yetkiniz yok.");

            _blogRepository.Remove(blog); // Soft Delete
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Silinen blogu geri yükler (IsDeleted = false)
        /// </summary>
        public async Task<bool> RestoreBlogAsync(int id, int authorId)
        {
            var blog = await _blogRepository.GetByIdAsync(id);

            if (blog == null)
                throw new InvalidOperationException($"Blog ID: {id} bulunamadı.");

            // Yetki kontrolü
            if (!await IsUserBlogOwnerAsync(id, authorId))
                throw new UnauthorizedAccessException("Bu blogu geri yükleme yetkiniz yok.");

            if (!blog.IsDeleted)
                throw new InvalidOperationException("Bu blog silinmemiş durumda.");

            _blogRepository.Restore(blog);
            await _unitOfWork.CommitAsync();

            return true;
        }

        /// <summary>
        /// Blogu kalıcı olarak siler (Hard Delete)
        /// </summary>
        public async Task<bool> PermanentlyDeleteBlogAsync(int id, int authorId)
        {
            var blog = await _blogRepository.GetByIdAsync(id);

            if (blog == null)
                throw new InvalidOperationException($"Blog ID: {id} bulunamadı.");

            // Yetki kontrolü: Sadece admin kalıcı silme yapabilir
            if (!await IsUserAdminAsync(authorId))
                throw new UnauthorizedAccessException("Kalıcı silme işlemi için admin yetkisi gerekli.");

            _blogRepository.HardDelete(blog); // Hard Delete - veritabanından tamamen sil
            await _unitOfWork.CommitAsync();

            return true;
        }

        #endregion

        #region SEARCH & FILTER

        /// <summary>
        /// Anahtar kelimeye göre blog arar (başlık ve içerikte)
        /// </summary>
        public async Task<List<BlogListDto>> SearchBlogsAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                throw new ArgumentException("Anahtar kelime boş olamaz.", nameof(keyword));

            var blogs = await _blogRepository.FindAsync(b =>
                !b.IsDeleted &&
                b.IsPublished &&
                (b.Title.Contains(keyword) || b.Content.Contains(keyword))
            );

            var result = blogs.Adapt<List<BlogListDto>>();
            return result;
        }

        /// <summary>
        /// Belirli bir tarih aralığında yayınlanan blogları getirir
        /// </summary>
        public async Task<List<BlogListDto>> GetBlogsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
                throw new ArgumentException("Başlangıç tarihi bitiş tarihinden sonra olamaz.");

            var blogs = await _blogRepository.FindAsync(b =>
                !b.IsDeleted &&
                b.IsPublished &&
                b.CreatedAt >= startDate &&
                b.CreatedAt <= endDate
            );

            var result = blogs.OrderByDescending(b => b.CreatedAt).ToList().Adapt<List<BlogListDto>>();
            return result;
        }

        #endregion

        #region VALIDATION & CHECK

        /// <summary>
        /// Blogun var olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsBlogExistsAsync(int id)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            return blog != null && !blog.IsDeleted;
        }

        /// <summary>
        /// Kullanıcının belirli bir blogun sahibi veya admin olup olmadığını kontrol eder
        /// </summary>
        public async Task<bool> IsUserBlogOwnerAsync(int blogId, int authorId)
        {
            var blog = await _blogRepository.GetByIdAsync(blogId);

            if (blog == null)
                return false;

            // Yazar ise veya admin ise true döner
            return blog.AuthorId == authorId || await IsUserAdminAsync(authorId);
        }

        /// <summary>
        /// Kullanıcının admin olup olmadığını kontrol eder
        /// </summary>
        private async Task<bool> IsUserAdminAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
                return false;

            // Role kontrolü entegrasyonu
            return false;
        }

        #endregion
    }
}

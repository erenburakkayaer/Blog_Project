using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    // İş kuralları burada: slug üretimi, kategori adını çözümleme/oluşturma, yayın tarihi ataması vb.
    public class BlogService : IBlogService
    {
        private readonly IBlogRepository _blogRepository;
        private readonly IGenericRepository<Category> _categoryRepository;
        private readonly IMapper _mapper;

        public BlogService(IBlogRepository blogRepository, IGenericRepository<Category> categoryRepository, IMapper mapper)
        {
            _blogRepository = blogRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BlogDto>> GetAllAsync()
        {
            var blogs = await _blogRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<BlogDto>>(blogs);
        }

        public async Task<PagedResultDto<BlogDto>> GetPagedAsync(int page, int pageSize, string? search = null)
        {
            var (blogs, totalCount) = await _blogRepository.GetPagedAsync(page, pageSize, search);
            return new PagedResultDto<BlogDto>
            {
                Items = _mapper.Map<IEnumerable<BlogDto>>(blogs),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<BlogDto?> GetByIdAsync(int id)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            if (blog is null) return null;

            // Her detay görüntülemesinde sayaç artar — okuma istatistikleri için
            blog.ViewCount++;
            _blogRepository.Update(blog);
            await _blogRepository.SaveChangesAsync();

            return _mapper.Map<BlogDto>(blog);
        }

        public async Task<BlogDto> CreateAsync(BlogCreateDto dto, int authorId)
        {
            var blog = _mapper.Map<Blog>(dto);
            blog.AuthorId = authorId;
            blog.CategoryId = await ResolveCategoryIdAsync(dto.Category);
            blog.Slug = SlugGenerator.Generate(dto.Title);
            blog.CreatedAt = DateTime.UtcNow;

            if (blog.Status == "published")
                blog.PublishedAt = DateTime.UtcNow;

            await _blogRepository.AddAsync(blog);
            await _blogRepository.SaveChangesAsync();

            var saved = await _blogRepository.GetByIdAsync(blog.Id);
            return _mapper.Map<BlogDto>(saved);
        }

        public async Task<bool> UpdateAsync(int id, BlogUpdateDto dto)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            if (blog is null) return false;

            var wasPublished = blog.Status == "published";

            blog.Title = dto.Title;
            blog.Summary = dto.Summary;
            blog.Content = dto.Content;
            blog.CoverImage = dto.CoverImage;
            blog.Status = dto.Status;
            blog.CategoryId = await ResolveCategoryIdAsync(dto.Category);

            if (dto.Status == "published" && !wasPublished)
                blog.PublishedAt = DateTime.UtcNow;

            blog.UpdatedAt = DateTime.UtcNow;

            _blogRepository.Update(blog);
            return await _blogRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            if (blog is null) return false;

            _blogRepository.Remove(blog);
            return await _blogRepository.SaveChangesAsync();
        }

        // Frontend'in (Samet) sabit kategori listesi serbest metin geliyor — DB'de eşleşen
        // Category yoksa otomatik oluşturulur, varsa mevcut Id kullanılır
        private async Task<int> ResolveCategoryIdAsync(string categoryName)
        {
            var categories = await _categoryRepository.GetAllAsync();
            var existing = categories.FirstOrDefault(c =>
                c.Type == "Blog" && c.Name.Equals(categoryName, StringComparison.OrdinalIgnoreCase));

            if (existing is not null) return existing.Id;

            var category = new Category { Name = categoryName, Slug = SlugGenerator.Generate(categoryName), Type = "Blog" };
            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();

            return category.Id;
        }
    }
}

using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    // İş kuralları burada: slug üretimi, yayın tarihi ataması vb.
    public class BlogService : IBlogService
    {
        private readonly IBlogRepository _blogRepository;
        private readonly IMapper _mapper;

        public BlogService(IBlogRepository blogRepository, IMapper mapper)
        {
            _blogRepository = blogRepository;
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

        public async Task<BlogDto> CreateAsync(BlogCreateDto dto)
        {
            var blog = _mapper.Map<Blog>(dto);
            blog.Slug = GenerateSlug(dto.Title);
            blog.CreatedAt = DateTime.UtcNow;
            blog.IsPublished = false;

            await _blogRepository.AddAsync(blog);
            await _blogRepository.SaveChangesAsync();

            return _mapper.Map<BlogDto>(blog);
        }

        public async Task<bool> UpdateAsync(int id, BlogUpdateDto dto)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            if (blog is null) return false;

            var wasPublished = blog.IsPublished;
            _mapper.Map(dto, blog);

            if (dto.IsPublished && !wasPublished)
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

        private static string GenerateSlug(string title) =>
            title.Trim().ToLowerInvariant().Replace(" ", "-");
    }
}

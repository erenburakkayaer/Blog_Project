using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    public interface IBlogService
    {
        Task<IEnumerable<BlogDto>> GetAllAsync();
        Task<PagedResultDto<BlogDto>> GetPagedAsync(int page, int pageSize, string? search = null);
        Task<BlogDto?> GetByIdAsync(int id);
        Task<BlogDto> CreateAsync(BlogCreateDto dto, int authorId);
        Task<bool> UpdateAsync(int id, BlogUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

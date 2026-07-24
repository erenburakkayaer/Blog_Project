using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    public interface ICommentService
    {
        Task<PagedResultDto<CommentDto>> GetPagedAsync(int page, int pageSize, string? search = null);
        Task<CommentDto?> GetByIdAsync(int id);
        Task<IEnumerable<CommentDto>> GetApprovedByBlogIdAsync(int blogId);
        Task<CommentDto> CreateAsync(CommentCreateDto dto);
        Task<bool> UpdateAsync(int id, CommentUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

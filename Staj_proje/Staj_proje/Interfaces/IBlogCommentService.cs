using Staj_proje.DTO.BlogComment;

namespace SStaj_proje.Interfaces
{
    public interface IBlogCommentService
    {
        // Create
        Task<int> CreateCommentAsync(int blogId, BlogCommentCreateDto createCommentDto, int userId);
        
        // Read
        Task<BlogCommentResponseDto> GetCommentByIdAsync(int id);
        Task<List<BlogCommentResponseDto>> GetCommentsByBlogAsync(int blogId);
        Task<List<BlogCommentResponseDto>> GetApprovedCommentsByBlogAsync(int blogId);
        Task<List<BlogCommentResponseDto>> GetCommentsByUserAsync(int userId);
        Task<List<BlogCommentResponseDto>> GetRepliesByParentCommentAsync(int parentCommentId);
        
        // Update
        Task<bool> UpdateCommentAsync(int id, BlogCommentUpdateDto updateCommentDto, int userId);
        Task<bool> ApproveCommentAsync(int id);
        Task<bool> DisapproveCommentAsync(int id);
        
        // Delete
        Task<bool> DeleteCommentAsync(int id, int userId);
        Task<bool> RestoreCommentAsync(int id);
        Task<bool> PermanentlyDeleteCommentAsync(int id);
        
        // Validation & Check
        Task<bool> IsCommentExistsAsync(int id);
        Task<bool> IsUserCommentOwnerAsync(int commentId, int userId);
        Task<bool> IsBlogExistsAsync(int blogId);
        
        // Statistics
        Task<int> GetCommentCountByBlogAsync(int blogId);
        Task<int> GetApprovedCommentCountByBlogAsync(int blogId);
    }
}
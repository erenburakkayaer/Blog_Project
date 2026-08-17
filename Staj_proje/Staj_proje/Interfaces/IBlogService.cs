using Staj_proje.DTO.Blog;

namespace Staj_proje.Services.Interfaces
{
    public interface IBlogService
    {
        // Create
        Task<int> CreateBlogAsync(BlogCreateDto createBlogDto, int authorId);
        
        // Read
        Task<BlogResponseDto> GetBlogByIdAsync(int id);
        Task<List<BlogListDto>> GetAllBlogsAsync();
        Task<List<BlogListDto>> GetPublishedBlogsAsync();
        Task<List<BlogListDto>> GetBlogsByAuthorAsync(int authorId);
        Task<List<BlogListDto>> GetBlogsByCategoryAsync(int categoryId);
        
        // Update
        Task<bool> UpdateBlogAsync(int id, BlogUpdateDto updateBlogDto, int authorId);
        Task<bool> PublishBlogAsync(int id, int authorId);
        Task<bool> UnpublishBlogAsync(int id, int authorId);
        
        // Delete
        Task<bool> DeleteBlogAsync(int id, int authorId);
        Task<bool> RestoreBlogAsync(int id, int authorId);
        Task<bool> PermanentlyDeleteBlogAsync(int id, int authorId);
        
        // Search & Filter
        Task<List<BlogListDto>> SearchBlogsAsync(string keyword);
        Task<List<BlogListDto>> GetBlogsByDateRangeAsync(DateTime startDate, DateTime endDate);
        
        // Validation & Check
        Task<bool> IsBlogExistsAsync(int id);
        Task<bool> IsUserBlogOwnerAsync(int blogId, int authorId);
    }
}
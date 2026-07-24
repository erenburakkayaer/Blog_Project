using BlogProject.API.Entities;

namespace BlogProject.API.Interfaces
{
    public interface ICommentRepository : IGenericRepository<Comment>
    {
        Task<IEnumerable<Comment>> GetApprovedByBlogIdAsync(int blogId);
    }
}

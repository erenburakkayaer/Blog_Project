using Microsoft.EntityFrameworkCore;
using BlogProject.API.Data;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Repositories
{
    public class CommentRepository : GenericRepository<Comment>, ICommentRepository
    {
        public CommentRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Comment>> GetApprovedByBlogIdAsync(int blogId) =>
            await _dbSet
                .Where(c => c.BlogId == blogId && c.IsApproved)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
    }
}

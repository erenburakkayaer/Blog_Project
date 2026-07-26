using Microsoft.EntityFrameworkCore;
using BlogProject.API.Data;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Repositories
{
    public class BlogRepository : GenericRepository<Blog>, IBlogRepository
    {
        public BlogRepository(AppDbContext context) : base(context) { }

        public async Task<Blog?> GetBySlugAsync(string slug) =>
            await _dbSet.FirstOrDefaultAsync(b => b.Slug == slug);

        public async Task<IEnumerable<Blog>> GetPublishedAsync() =>
            await _dbSet.Where(b => b.Status == "published").ToListAsync();

        public override async Task<IEnumerable<Blog>> GetAllAsync() =>
            await _dbSet.Include(b => b.Author).Include(b => b.Category).ToListAsync();

        public override async Task<Blog?> GetByIdAsync(int id) =>
            await _dbSet.Include(b => b.Author).Include(b => b.Category).FirstOrDefaultAsync(b => b.Id == id);

        public override async Task<(IEnumerable<Blog> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search = null)
        {
            var query = _dbSet.Include(b => b.Author).Include(b => b.Category).AsQueryable();

            var predicate = BuildSearchPredicate(search);
            if (predicate is not null)
                query = query.Where(predicate);

            query = query.OrderByDescending(b => b.Id);

            var totalCount = await query.CountAsync();
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return (items, totalCount);
        }
    }
}

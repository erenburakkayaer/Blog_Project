using Microsoft.EntityFrameworkCore;
using BlogProject.API.Data;
using BlogProject.API.Entities;

namespace BlogProject.API.Repositories
{
    // Kategori adının DTO'da görünmesi için Category Include'lu sorgular
    public class ProjectRepository : GenericRepository<Project>
    {
        public ProjectRepository(AppDbContext context) : base(context) { }

        public override async Task<IEnumerable<Project>> GetAllAsync() =>
            await _dbSet.Include(p => p.Category).ToListAsync();

        public override async Task<Project?> GetByIdAsync(int id) =>
            await _dbSet.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);

        public override async Task<(IEnumerable<Project> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search = null)
        {
            var query = _dbSet.Include(p => p.Category).AsQueryable();

            var predicate = BuildSearchPredicate(search);
            if (predicate is not null)
                query = query.Where(predicate);

            query = query.OrderByDescending(p => p.Id);

            var totalCount = await query.CountAsync();
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return (items, totalCount);
        }
    }
}

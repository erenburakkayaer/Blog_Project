using Microsoft.EntityFrameworkCore;
using BlogProject.API.Data;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Repositories
{
    public class MessageRepository : GenericRepository<Message>, IMessageRepository
    {
        public MessageRepository(AppDbContext context) : base(context) { }

        public async Task<(IEnumerable<Message> Items, int TotalCount)> GetFilteredPagedAsync(
            int page, int pageSize, string? search, bool? isRead, bool? isImportant, bool? isArchived)
        {
            var query = _dbSet.AsQueryable();

            var predicate = BuildSearchPredicate(search);
            if (predicate is not null)
                query = query.Where(predicate);

            if (isRead.HasValue)
                query = query.Where(m => m.IsRead == isRead.Value);

            if (isImportant.HasValue)
                query = query.Where(m => m.IsImportant == isImportant.Value);

            if (isArchived.HasValue)
                query = query.Where(m => m.IsArchived == isArchived.Value);

            query = query.OrderByDescending(m => m.CreatedAt);

            var totalCount = await query.CountAsync();
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return (items, totalCount);
        }
    }
}

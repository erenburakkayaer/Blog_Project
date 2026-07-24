using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using BlogProject.API.Data;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Repositories
{
    // Sadece veritabanı erişimi burada yapılır — iş kuralı yok
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        // Arama yapılırken entity üzerinde bu isimlerden hangisi varsa (string tipinde) o alanlarda aranır
        private static readonly string[] SearchableCandidateProperties =
            { "Title", "Name", "Username", "Email", "Subject", "CompanyName", "FullName", "Content" };

        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();

        public virtual async Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? search = null)
        {
            var query = _dbSet.AsQueryable();

            var predicate = BuildSearchPredicate(search);
            if (predicate is not null)
                query = query.Where(predicate);

            // Id her entity'de var; EF.Property ile generic (compile-time property erişimi olmadan) sıralama
            query = query.OrderBy(e => EF.Property<int>(e, "Id"));

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        // T tipinde hangi arama alanı gerçekten varsa (Title, Name, Username vb.) sadece onlar üzerinden OR'lu Contains kurar
        protected static Expression<Func<T, bool>>? BuildSearchPredicate(string? search)
        {
            if (string.IsNullOrWhiteSpace(search))
                return null;

            var param = Expression.Parameter(typeof(T), "e");
            var containsMethod = typeof(string).GetMethod(nameof(string.Contains), new[] { typeof(string) })!;
            var searchConstant = Expression.Constant(search);

            Expression? combined = null;
            foreach (var propName in SearchableCandidateProperties)
            {
                var prop = typeof(T).GetProperty(propName);
                if (prop is null || prop.PropertyType != typeof(string)) continue;

                var propAccess = Expression.Property(param, prop);
                var notNull = Expression.NotEqual(propAccess, Expression.Constant(null, typeof(string)));
                var containsCall = Expression.Call(propAccess, containsMethod, searchConstant);
                var condition = Expression.AndAlso(notNull, containsCall);

                combined = combined is null ? condition : Expression.OrElse(combined, condition);
            }

            return combined is null ? null : Expression.Lambda<Func<T, bool>>(combined, param);
        }

        public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);

        public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);

        public void Update(T entity) => _dbSet.Update(entity);

        public void Remove(T entity) => _dbSet.Remove(entity);

        public async Task<bool> SaveChangesAsync() => await _context.SaveChangesAsync() > 0;
    }
}

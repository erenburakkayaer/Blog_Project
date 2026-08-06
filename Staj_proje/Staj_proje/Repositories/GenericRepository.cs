using Staj_proje.Data;
using Microsoft.EntityFrameworkCore;
using Staj_proje.Interfaces;
using System.Linq.Expressions;

namespace Staj_proje.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);

        public async Task<List<T>> GetAllAsync() => await _dbSet.ToListAsync();

        public async Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate)
            => await _dbSet.Where(predicate).ToListAsync();

        public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);

        public void Update(T entity) => _dbSet.Update(entity);

        public void Remove(T entity)
        {
            // Eğer entity ISoftDelete arayüzünü uyguluyorsa IsDeleted = true yap
            if (entity is ISoftDelete softDeleteEntity)
            {
                softDeleteEntity.IsDeleted = true;
                _dbSet.Update(entity); // Soft Delete (Güncelleme işlemi)
            }
            else
            {
                // ISoftDelete uygulamayan standart entity ise veritabanından tamamen sil
                _dbSet.Remove(entity);
            }
        }
        public void HardDelete(T entity)
        {
            // IsDeleted durumuna bakılmaksızın doğrudan SQL DELETE atar
            _dbSet.Remove(entity);
        }
        public void Restore(T entity)
        {
            if (entity is ISoftDelete softDeleteEntity)
            {
                softDeleteEntity.IsDeleted = false;
                _dbSet.Update(entity);
            }
        }
    }
}

using Microsoft.EntityFrameworkCore;
using BlogProject.API.Data;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task<User?> GetByUsernameAsync(string username) =>
            await _dbSet.FirstOrDefaultAsync(u => u.Username == username);

        public async Task<User?> GetByUsernameWithRoleAsync(string username) =>
            await _dbSet.Include(u => u.Role).FirstOrDefaultAsync(u => u.Username == username);

        public async Task<User?> GetByIdWithRoleAsync(int id) =>
            await _dbSet.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);

        public async Task<IEnumerable<User>> GetAllWithRoleAsync() =>
            await _dbSet.Include(u => u.Role).ToListAsync();

        public override async Task<(IEnumerable<User> Items, int TotalCount)> GetPagedAsync(int page, int pageSize)
        {
            var query = _dbSet.Include(u => u.Role).OrderBy(u => u.Id);

            var totalCount = await query.CountAsync();
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return (items, totalCount);
        }
    }
}

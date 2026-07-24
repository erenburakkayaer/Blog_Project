using Microsoft.EntityFrameworkCore;
using BlogProject.API.Data;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Repositories
{
    public class RefreshTokenRepository : GenericRepository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(AppDbContext context) : base(context) { }

        public async Task<RefreshToken?> GetActiveByTokenAsync(string token)
        {
            var refreshToken = await _dbSet
                .Include(rt => rt.User)
                    .ThenInclude(u => u!.Role)
                .FirstOrDefaultAsync(rt => rt.Token == token);

            return refreshToken is not null && refreshToken.IsActive ? refreshToken : null;
        }
    }
}

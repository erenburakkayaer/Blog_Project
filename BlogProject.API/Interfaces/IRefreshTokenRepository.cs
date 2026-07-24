using BlogProject.API.Entities;

namespace BlogProject.API.Interfaces
{
    public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>
    {
        Task<RefreshToken?> GetActiveByTokenAsync(string token);
    }
}

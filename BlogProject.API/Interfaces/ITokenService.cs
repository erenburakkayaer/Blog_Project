using BlogProject.API.Entities;

namespace BlogProject.API.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user, out DateTime expiresAt);
        string GenerateRefreshToken();
    }
}

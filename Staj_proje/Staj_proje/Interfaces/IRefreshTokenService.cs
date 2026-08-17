using Staj_proje.Entities;

namespace Staj_proje.Services.Interfaces
{
    public interface IRefreshTokenService
    {
        // Create
        Task<RefreshToken> CreateRefreshTokenAsync(int userId, string ipAddress);
        Task<RefreshToken> GenerateRefreshTokenAsync(int userId, string ipAddress);
        
        // Read
        Task<RefreshToken> GetRefreshTokenByIdAsync(int id);
        Task<RefreshToken> GetRefreshTokenByTokenAsync(string token);
        Task<List<RefreshToken>> GetRefreshTokensByUserAsync(int userId);
        Task<List<RefreshToken>> GetActiveRefreshTokensByUserAsync(int userId);
        Task<List<RefreshToken>> GetExpiredRefreshTokensByUserAsync(int userId);
        Task<List<RefreshToken>> GetRevokedRefreshTokensByUserAsync(int userId);
        
        // Validation & Check
        Task<bool> IsRefreshTokenValidAsync(string token);
        Task<bool> IsRefreshTokenExpiredAsync(string token);
        Task<bool> IsRefreshTokenRevokedAsync(string token);
        Task<bool> IsRefreshTokenActiveAsync(string token);
        Task<bool> DoesRefreshTokenExistAsync(string token);
        Task<bool> IsRefreshTokenBelongsToUserAsync(string token, int userId);
        
        // Update - Token Rotation
        Task<RefreshToken> RotateRefreshTokenAsync(string oldToken, string ipAddress);
        Task<bool> RevokeRefreshTokenAsync(string token, string ipAddress);
        Task<bool> RevokeRefreshTokenByIdAsync(int id, string ipAddress);
        
        // Revoke Operations
        Task<bool> RevokeAllUserTokensAsync(int userId, string ipAddress);
        Task<bool> RevokeAllExpiredTokensAsync();
        
        // Delete
        Task<bool> DeleteRefreshTokenAsync(int id);
        Task<bool> DeleteRefreshTokenByTokenAsync(string token);
        Task<bool> DeleteUserRefreshTokensAsync(int userId);
        Task<bool> DeleteExpiredRefreshTokensAsync();
        
        // Statistics
        Task<int> GetTotalRefreshTokenCountAsync();
        Task<int> GetActiveRefreshTokenCountAsync();
        Task<int> GetRevokedRefreshTokenCountAsync();
        Task<int> GetExpiredRefreshTokenCountAsync();
        Task<int> GetActiveTokenCountByUserAsync(int userId);
        
        // Cleanup
        Task<int> CleanupExpiredTokensAsync();
        Task<int> CleanupRevokedTokensAsync(int retentionDays = 30);
    }
}
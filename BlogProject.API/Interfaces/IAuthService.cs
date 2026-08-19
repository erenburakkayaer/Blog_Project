using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginDto dto);
        Task<LoginResponseDto?> RegisterAsync(RegisterDto dto);
        Task<bool> UserExistsAsync(string identifier);
        Task<LoginResponseDto?> RefreshTokenAsync(string refreshToken);
        Task<bool> LogoutAsync(string refreshToken);
        Task<UserDto?> GetCurrentUserAsync(int userId);
    }
}

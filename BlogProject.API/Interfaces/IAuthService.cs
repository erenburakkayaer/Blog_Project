using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginDto dto);
        Task<LoginResponseDto?> RefreshTokenAsync(string refreshToken);
    }
}

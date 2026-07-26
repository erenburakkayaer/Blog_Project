using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Authentication
{
    // Giriş / token yenileme iş kuralı burada: kullanıcı doğrulama, refresh token rotasyonu
    public class AuthService : IAuthService
    {
        private const int RefreshTokenExpiryDays = 7;

        private readonly IUserRepository _userRepository;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AuthService(
            IUserRepository userRepository,
            IRefreshTokenRepository refreshTokenRepository,
            ITokenService tokenService,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _refreshTokenRepository = refreshTokenRepository;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByUsernameWithRoleAsync(dto.Username);

            if (user is null || !user.IsActive)
                return null;

            if (!PasswordHasher.Verify(dto.Password, user.PasswordHash))
                return null;

            user.LastLoginAt = DateTime.UtcNow;
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();

            return await IssueTokensAsync(user);
        }

        public async Task<LoginResponseDto?> RefreshTokenAsync(string refreshToken)
        {
            var existing = await _refreshTokenRepository.GetActiveByTokenAsync(refreshToken);
            if (existing is null || existing.User is null || !existing.User.IsActive)
                return null;

            // Rotasyon: eski refresh token iptal edilir, yenisi verilir
            existing.RevokedAt = DateTime.UtcNow;
            _refreshTokenRepository.Update(existing);
            await _refreshTokenRepository.SaveChangesAsync();

            return await IssueTokensAsync(existing.User);
        }

        private async Task<LoginResponseDto> IssueTokensAsync(User user)
        {
            var accessToken = _tokenService.GenerateToken(user, out var expiresAt);
            var refreshTokenValue = _tokenService.GenerateRefreshToken();

            await _refreshTokenRepository.AddAsync(new RefreshToken
            {
                UserId = user.Id,
                Token = refreshTokenValue,
                ExpiresAt = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays),
                CreatedAt = DateTime.UtcNow
            });
            await _refreshTokenRepository.SaveChangesAsync();

            return new LoginResponseDto
            {
                AccessToken = accessToken,
                ExpiresAt = expiresAt,
                RefreshToken = refreshTokenValue,
                User = _mapper.Map<UserDto>(user)
            };
        }
    }
}

using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Authentication
{
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

        public async Task<LoginResponseDto?> RegisterAsync(RegisterDto dto)
        {
            var existing = await _userRepository.GetByUsernameWithRoleAsync(dto.Email);
            if (existing is not null)
                return null;

            var username = !string.IsNullOrWhiteSpace(dto.Username)
                ? dto.Username.Trim().ToLowerInvariant()
                : dto.Email.Split('@')[0].Trim().ToLowerInvariant();

            var roleId = dto.Role?.ToLowerInvariant() switch
            {
                "admin" or "superadmin" => 2,
                "hr" or "editor" => 3,
                _ => 4 // Yazar / Normal üye
            };

            var newUser = new User
            {
                Username = username,
                Email = dto.Email.Trim().ToLowerInvariant(),
                PasswordHash = PasswordHasher.Hash(dto.Password),
                RoleId = roleId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(newUser);
            await _userRepository.SaveChangesAsync();

            var createdUser = await _userRepository.GetByIdWithRoleAsync(newUser.Id);
            return await IssueTokensAsync(createdUser!);
        }

        public async Task<bool> UserExistsAsync(string identifier)
        {
            if (string.IsNullOrWhiteSpace(identifier)) return false;
            var user = await _userRepository.GetByUsernameAsync(identifier.Trim().ToLowerInvariant());
            return user is not null;
        }

        public async Task<LoginResponseDto?> RefreshTokenAsync(string refreshToken)
        {
            var existing = await _refreshTokenRepository.GetActiveByTokenAsync(refreshToken);
            if (existing is null || existing.User is null || !existing.User.IsActive)
                return null;

            existing.RevokedAt = DateTime.UtcNow;
            _refreshTokenRepository.Update(existing);
            await _refreshTokenRepository.SaveChangesAsync();

            return await IssueTokensAsync(existing.User);
        }

        public async Task<bool> LogoutAsync(string refreshToken)
        {
            var existing = await _refreshTokenRepository.GetActiveByTokenAsync(refreshToken);
            if (existing is null) return false;

            existing.RevokedAt = DateTime.UtcNow;
            _refreshTokenRepository.Update(existing);
            return await _refreshTokenRepository.SaveChangesAsync();
        }

        public async Task<UserDto?> GetCurrentUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdWithRoleAsync(userId);
            return user is null ? null : _mapper.Map<UserDto>(user);
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

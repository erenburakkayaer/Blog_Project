using Microsoft.Extensions.Configuration;
using BlogProject.API.Authentication;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Helpers;
using BlogProject.API.Repositories;

namespace BlogProject.Tests.Authentication
{
    public class AuthServiceTests
    {
        private static IConfiguration CreateJwtConfig() =>
            new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "test-signing-key-en-az-32-karakter-uzunlugunda-olmali",
                ["Jwt:Issuer"] = "BlogProject.Tests",
                ["Jwt:Audience"] = "BlogProject.Tests.Client",
                ["Jwt:ExpiryMinutes"] = "60"
            }).Build();

        private static async Task<(AuthService authService, BlogProject.API.Data.AppDbContext context)> CreateServiceAsync()
        {
            var context = TestHelpers.CreateContext();
            var mapper = TestHelpers.CreateMapper();

            context.Roles.Add(new Role { Id = 1, Name = "SuperAdmin" });
            context.Users.Add(new User
            {
                Id = 1,
                Username = "admin",
                Email = "admin@firmaadi.com",
                PasswordHash = PasswordHasher.Hash("Admin123!"),
                RoleId = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
            await context.SaveChangesAsync();

            var userRepository = new UserRepository(context);
            var refreshTokenRepository = new RefreshTokenRepository(context);
            var tokenService = new TokenService(CreateJwtConfig());

            return (new AuthService(userRepository, refreshTokenRepository, tokenService, mapper), context);
        }

        [Fact]
        public async Task LoginAsync_DogruBilgilerle_TokenDoner()
        {
            var (authService, _) = await CreateServiceAsync();

            var result = await authService.LoginAsync(new LoginDto { Username = "admin", Password = "Admin123!" });

            Assert.NotNull(result);
            Assert.False(string.IsNullOrWhiteSpace(result!.AccessToken));
            Assert.False(string.IsNullOrWhiteSpace(result.RefreshToken));
        }

        [Fact]
        public async Task LoginAsync_YanlisParola_NullDoner()
        {
            var (authService, _) = await CreateServiceAsync();

            var result = await authService.LoginAsync(new LoginDto { Username = "admin", Password = "YanlisParola" });

            Assert.Null(result);
        }

        [Fact]
        public async Task LoginAsync_PasifKullanici_NullDoner()
        {
            var (authService, context) = await CreateServiceAsync();
            var user = context.Users.First();
            user.IsActive = false;
            await context.SaveChangesAsync();

            var result = await authService.LoginAsync(new LoginDto { Username = "admin", Password = "Admin123!" });

            Assert.Null(result);
        }

        [Fact]
        public async Task RefreshTokenAsync_EskiTokenRotasyonSonrasiGecersiz()
        {
            var (authService, _) = await CreateServiceAsync();
            var login = await authService.LoginAsync(new LoginDto { Username = "admin", Password = "Admin123!" });

            var refreshed = await authService.RefreshTokenAsync(login!.RefreshToken);
            Assert.NotNull(refreshed);

            // Eski (kullanılmış) refresh token bir daha kullanılamaz
            var secondAttempt = await authService.RefreshTokenAsync(login.RefreshToken);
            Assert.Null(secondAttempt);
        }
    }
}

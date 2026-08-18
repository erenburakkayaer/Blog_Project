using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Staj_proje.DTO.User;
using Staj_proje.Services.Interfaces;

namespace Staj_proje.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IRefreshTokenService _refreshTokenService;

        public AuthController(IUserService userService, IRefreshTokenService refreshTokenService)
        {
            _userService = userService;
            _refreshTokenService = refreshTokenService;
        }

        /// <summary>
        /// Kullanıcı Girişi (Login)
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (success, message, user) = await _userService.LoginAsync(loginDto);
            if (!success || user == null)
                return Unauthorized(new { message = message ?? "Giriş başarısız. Bilgilerinizi kontrol ediniz." });

            var roleNames = await _userService.GetUserRoleNamesAsync(user.Id);

            return Ok(new
            {
                message = "Giriş başarılı.",
                user = new
                {
                    id = user.Id,
                    userName = user.UserName,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    fullName = $"{user.FirstName} {user.LastName}".Trim(),
                    jobTitle = user.JobTitle,
                    roles = roleNames
                }
            });
        }

        /// <summary>
        /// Yeni Kullanıcı Kaydı (Register)
        /// </summary>
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] CreateUserDto registerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var isEmailTaken = await _userService.IsUserExistsByEmailAsync(registerDto.Email);
            if (isEmailTaken)
                return BadRequest(new { message = "Bu e-posta adresi zaten kullanımda." });

            var userId = await _userService.CreateUserAsync(registerDto);
            return Ok(new { message = "Kayıt başarıyla tamamlandı.", userId });
        }

        /// <summary>
        /// Giriş Yapmış Kullanıcının Profil Bilgilerini Getirir
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "Geçersiz oturum bilgisi." });

            var userDto = await _userService.GetCurrentUserAsync(userId);
            if (userDto == null)
                return NotFound(new { message = "Kullanıcı bulunamadı." });

            var roles = await _userService.GetUserRoleNamesAsync(userId);

            return Ok(new { user = userDto, roles });
        }

        /// <summary>
        /// Şifre Değiştirme
        /// </summary>
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var result = await _userService.ChangePasswordAsync(userId, changePasswordDto);
            if (!result)
                return BadRequest(new { message = "Mevcut şifre hatalı veya şifre güncellenemedi." });

            return Ok(new { message = "Şifreniz başarıyla değiştirildi." });
        }

        /// <summary>
        /// Çıkış Yap (Logout)
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                await _userService.LogoutAsync(userId);
            }
            return Ok(new { message = "Başarıyla çıkış yapıldı." });
        }
    }
}

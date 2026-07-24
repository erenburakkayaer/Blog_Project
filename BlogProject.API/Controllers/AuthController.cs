using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            return result is null
                ? Unauthorized(new { message = "Kullanıcı adı veya parola hatalı." })
                : Ok(result);
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponseDto>> Refresh(RefreshRequestDto dto)
        {
            var result = await _authService.RefreshTokenAsync(dto.RefreshToken);
            return result is null
                ? Unauthorized(new { message = "Refresh token geçersiz veya süresi dolmuş." })
                : Ok(result);
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult Me() =>
            Ok(new
            {
                Username = User.Identity?.Name,
                Role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
            });
    }
}

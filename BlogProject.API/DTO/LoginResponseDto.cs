namespace BlogProject.API.DTO
{
    public class LoginResponseDto
    {
        // Samet'in frontend'i "accessToken" ismini bekliyor (authService.js'teki entegrasyon örneğine bakınız)
        public string AccessToken { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
    }
}

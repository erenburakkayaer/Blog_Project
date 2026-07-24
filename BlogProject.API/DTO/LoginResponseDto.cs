namespace BlogProject.API.DTO
{
    public class LoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
    }
}

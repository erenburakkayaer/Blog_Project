namespace Staj_proje.DTO.User
{
    public class CreateUserDto
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? JobTitle { get; set; }
        public int? AvatarFileAssetId { get; set; }
    }
}

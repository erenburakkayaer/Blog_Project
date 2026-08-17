namespace Staj_proje.DTO.User
{
    public class UpdateUserdto
    {
        public string? UserName { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? JobTitle { get; set; }
        public int? AvatarFileAssetId { get; set; }
    }
}

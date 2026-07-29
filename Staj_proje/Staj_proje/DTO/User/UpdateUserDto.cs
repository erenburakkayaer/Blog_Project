namespace Staj_proje.DTO.User
{
    public class UpdateUserdto
    {
        public int Id { get; set; }
        public string? UserName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? JobTitle { get; set; }
        public int? AvatarFileAssetId { get; set; }
    }
}

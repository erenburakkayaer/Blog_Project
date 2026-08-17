using Microsoft.AspNetCore.Identity;

namespace Staj_proje.Entities
{

    public class User : IdentityUser<int>
    {
        public string? JobTitle { get; set; }

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int? AvatarFileAssetId { get; set; }
        public FileAsset? AvatarFileAsset { get; set; }
        public ICollection<Blog> Blogs { get; set; } = new HashSet<Blog>();
        public ICollection<Page> Pages { get; set; } = new HashSet<Page>();
        public ICollection<Log> Logs { get; set; } = new HashSet<Log>();

        // Güvenlik & Oturum Yönetimi İlişkisi
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new HashSet<RefreshToken>();
    }
}

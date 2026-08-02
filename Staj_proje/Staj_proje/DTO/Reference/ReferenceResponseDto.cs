using Staj_proje.Entities;

namespace Staj_proje.DTO.Reference
{
    public class ReferenceResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public int LogoFileAssetId { get; set; }
        public string LogoUrl { get; set; } = string.Empty; // FileAsset üzerinden türetilen doğrudan erişilebilir logo URL'i

        public string? WebsiteUrl { get; set; }
        public string? Sector { get; set; }

        public ReferenceType Type { get; set; }

        public int DisplayOrder { get; set; }
        public bool IsShowOnHome { get; set; }
        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}

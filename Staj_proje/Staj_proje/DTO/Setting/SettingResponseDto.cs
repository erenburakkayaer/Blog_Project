namespace Staj_proje.DTO.Setting
{
    public class SettingResponseDto
    {
        public int Id { get; set; }

        // Genel Firma & Site Bilgileri
        public string? SiteName { get; set; }
        public string? SiteTitle { get; set; }
        public string? SiteDescription { get; set; }

        // Görsel URL Düzleştirmeleri (Flattening)
        public int? LogoFileAssetId { get; set; }
        public string? LogoUrl { get; set; }

        public int? HeaderLogoFileAssetId { get; set; }
        public string? HeaderLogoUrl { get; set; }

        public int? FooterLogoFileAssetId { get; set; }
        public string? FooterLogoUrl { get; set; }

        public int? FaviconFileAssetId { get; set; }
        public string? FaviconUrl { get; set; }

        // İletişim Bilgileri
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? WhatsAppPhone { get; set; }
        public string? Address { get; set; }
        public string? GoogleMapsEmbedUrl { get; set; }

        // Sosyal Medya Bağlantıları
        public string? LinkedinUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? InstagramUrl { get; set; }

        // Sistem Ayarları
        public bool IsMaintenanceMode { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

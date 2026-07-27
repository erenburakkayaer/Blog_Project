namespace Staj_proje.Entities
{
    public class Setting
    {
        public int Id { get; set; }

        // Genel Firma & Site Bilgileri
        public string? SiteName { get; set; } = string.Empty;
        public string? SiteTitle { get; set; } = string.Empty;
        public string? SiteDescription { get; set; } = string.Empty;
        // Genel Logo
        public int? LogoFileAssetId { get; set; }
        public FileAsset? LogoFileAsset { get; set; }

        // Header (Üst Menü) Logosu
        public int? HeaderLogoFileAssetId { get; set; }
        public FileAsset? HeaderLogoFileAsset { get; set; }

        // Footer (Alt Menü) Logosu
        public int? FooterLogoFileAssetId { get; set; }
        public FileAsset? FooterLogoFileAsset { get; set; }

        // Tarayıcı Sekme Simgesi (Favicon)
        public int? FaviconFileAssetId { get; set; }
        public FileAsset? FaviconFileAsset { get; set; }
        // İletişim Bilgileri
        public string? Email { get; set; } = string.Empty;
        public string? Phone { get; set; } = string.Empty;
        public string? WhatsAppPhone { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;
        public string? GoogleMapsEmbedUrl { get; set; } = string.Empty;

        // Sosyal Medya Bağlantıları
        public string? LinkedinUrl { get; set; } = string.Empty;
        public string? GithubUrl { get; set; } = string.Empty;
        public string? TwitterUrl { get; set; } = string.Empty;
        public string? InstagramUrl { get; set; } = string.Empty;

        // Sistem Ayarları
        public bool IsMaintenanceMode { get; set; } = false; // Bakım modu açık mı?
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

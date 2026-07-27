namespace Staj_proje.Entities
{
    public class SeoSetting
    {
        public int Id { get; set; }

        // Temel Meta Etiketleri
        public string MetaTitle { get; set; } = null!;
        public string MetaDescription { get; set; } = null!;
        public string? MetaKeywords { get; set; }
        public string? Author { get; set; }

        // Open Graph (Facebook, LinkedIn paylaşım kartları)
        public string? OgTitle { get; set; }
        public string? OgDescription { get; set; }
        public int? OgImageAssetId { get; set; }
        public FileAsset? OgImageAsset { get; set; } // Paylaşımda görünecek varsayılan resim

        // Bot & İndeksleme Yönetimi
        public string? GoogleAnalyticsId { get; set; } = string.Empty; // Örn: "G-XXXXXXXXXX"
        public string? GoogleSearchConsoleCode { get; set; } = string.Empty; // Meta doğrulama kodu
        public string? RobotsTxtContent { get; set; } = string.Empty; // Dynamic robots.txt içeriği
        public bool IndexSite { get; set; } = false;            // noindex / index kuralı

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

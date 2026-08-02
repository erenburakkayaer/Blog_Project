namespace Staj_proje.DTO.SeoSetting
{
    public class SeoSettingResponseDto
    {
        public int Id { get; set; }

        // Temel Meta Etiketleri
        public string MetaTitle { get; set; } = string.Empty;
        public string MetaDescription { get; set; } = string.Empty;
        public string? MetaKeywords { get; set; }
        public string? Author { get; set; }

        // Open Graph Bilgileri
        public string? OgTitle { get; set; }
        public string? OgDescription { get; set; }
        public int? OgImageAssetId { get; set; }
        public string? OgImageUrl { get; set; } // FileAsset üzerinden türetilen görsel URL'i

        // Bot ve Analitik Yönetimi
        public string? GoogleAnalyticsId { get; set; }
        public string? GoogleSearchConsoleCode { get; set; }
        public string? RobotsTxtContent { get; set; }
        public bool IndexSite { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}
}

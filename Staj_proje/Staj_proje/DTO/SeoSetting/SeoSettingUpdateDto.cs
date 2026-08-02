using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.SeoSetting
{
    public class SeoSettingUpdateDto
    {
        [Required(ErrorMessage = "Meta başlığı (MetaTitle) zorunludur.")]
        [StringLength(70, ErrorMessage = "Meta başlığı Google görünürlüğü için en fazla 70 karakter olmalıdır.")]
        public string MetaTitle { get; set; } = string.Empty;

        [Required(ErrorMessage = "Meta açıklaması (MetaDescription) zorunludur.")]
        [StringLength(160, ErrorMessage = "Meta açıklaması Google görünürlüğü için en fazla 160 karakter olmalıdır.")]
        public string MetaDescription { get; set; } = string.Empty;

        [StringLength(255, ErrorMessage = "Meta anahtar kelimeleri en fazla 255 karakter olabilir.")]
        public string? MetaKeywords { get; set; }

        [StringLength(100, ErrorMessage = "Yazar bilgisi en fazla 100 karakter olabilir.")]
        public string? Author { get; set; }

        [StringLength(70, ErrorMessage = "Social / Open Graph başlığı en fazla 70 karakter olabilir.")]
        public string? OgTitle { get; set; }

        [StringLength(200, ErrorMessage = "Social / Open Graph açıklaması en fazla 200 karakter olabilir.")]
        public string? OgDescription { get; set; }

        public int? OgImageAssetId { get; set; }

        [StringLength(50, ErrorMessage = "Google Analytics ID en fazla 50 karakter olabilir.")]
        public string? GoogleAnalyticsId { get; set; }

        [StringLength(255, ErrorMessage = "Google Search Console kodu en fazla 255 karakter olabilir.")]
        public string? GoogleSearchConsoleCode { get; set; }

        public string? RobotsTxtContent { get; set; }

        public bool IndexSite { get; set; }
    }
}

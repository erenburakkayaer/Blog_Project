using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Setting
{
    public class SettingUpdateDto
    {
        [StringLength(100, ErrorMessage = "Site adı en fazla 100 karakter olabilir.")]
        public string? SiteName { get; set; }

        [StringLength(150, ErrorMessage = "Site başlığı en fazla 150 karakter olabilir.")]
        public string? SiteTitle { get; set; }

        [StringLength(500, ErrorMessage = "Site açıklaması en fazla 500 karakter olabilir.")]
        public string? SiteDescription { get; set; }

        // Görsel Bağlantıları
        public int? LogoFileAssetId { get; set; }
        public int? HeaderLogoFileAssetId { get; set; }
        public int? FooterLogoFileAssetId { get; set; }
        public int? FaviconFileAssetId { get; set; }

        // İletişim Bilgileri
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        [StringLength(100, ErrorMessage = "E-posta en fazla 100 karakter olabilir.")]
        public string? Email { get; set; }

        [Phone(ErrorMessage = "Geçerli bir telefon numarası giriniz.")]
        [StringLength(30, ErrorMessage = "Telefon numarası en fazla 30 karakter olabilir.")]
        public string? Phone { get; set; }

        [Phone(ErrorMessage = "Geçerli bir WhatsApp telefon numarası giriniz.")]
        [StringLength(30, ErrorMessage = "WhatsApp numarası en fazla 30 karakter olabilir.")]
        public string? WhatsAppPhone { get; set; }

        [StringLength(300, ErrorMessage = "Adres en fazla 300 karakter olabilir.")]
        public string? Address { get; set; }

        public string? GoogleMapsEmbedUrl { get; set; }

        // Sosyal Medya Bağlantıları
        [Url(ErrorMessage = "Geçerli bir LinkedIn web adresi giriniz.")]
        public string? LinkedinUrl { get; set; }

        [Url(ErrorMessage = "Geçerli bir GitHub web adresi giriniz.")]
        public string? GithubUrl { get; set; }

        [Url(ErrorMessage = "Geçerli bir Twitter/X web adresi giriniz.")]
        public string? TwitterUrl { get; set; }

        [Url(ErrorMessage = "Geçerli bir Instagram web adresi giriniz.")]
        public string? InstagramUrl { get; set; }

        // Sistem Ayarları
        public bool IsMaintenanceMode { get; set; }
    }
}

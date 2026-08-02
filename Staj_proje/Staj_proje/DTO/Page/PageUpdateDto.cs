using Staj_proje.Entities;
using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Page
{
    public class PageUpdateDto
    {
        [Required(ErrorMessage = "Sayfa başlığı zorunludur.")]
        [StringLength(150, ErrorMessage = "Sayfa başlığı en fazla 150 karakter olabilir.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "URL yolu (Slug) alanı zorunludur.")]
        [StringLength(150, ErrorMessage = "URL yolu (Slug) en fazla 150 karakter olabilir.")]
        public string Slug { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Kısa özet en fazla 500 karakter olabilir.")]
        public string? Summary { get; set; }

        public string? Content { get; set; }

        [EnumDataType(typeof(PageType), ErrorMessage = "Geçerli bir sayfa türü seçiniz.")]
        public PageType Type { get; set; }

        public bool IsActive { get; set; }
        public bool ShowInHeader { get; set; }
        public bool ShowInFooter { get; set; }

        public int DisplayOrder { get; set; }

        public int? SeoSettingId { get; set; }
        public int? BannerImageAssetId { get; set; }
    }
}

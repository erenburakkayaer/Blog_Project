using System.ComponentModel.DataAnnotations;
using Staj_proje.Entities;

namespace Staj_proje.DTO.Reference
{
    public class ReferenceCreateDto
    {
        [Required(ErrorMessage = "Referans firma adı zorunludur.")]
        [StringLength(150, ErrorMessage = "Firma adı en fazla 150 karakter olabilir.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Logo görseli (FileAsset) seçilmelidir.")]
        public int LogoFileAssetId { get; set; }

        [Url(ErrorMessage = "Geçerli bir web adresi (URL) giriniz.")]
        [StringLength(250, ErrorMessage = "Web adresi en fazla 250 karakter olabilir.")]
        public string? WebsiteUrl { get; set; }

        [StringLength(100, ErrorMessage = "Sektör bilgisi en fazla 100 karakter olabilir.")]
        public string? Sector { get; set; }

        [EnumDataType(typeof(ReferenceType), ErrorMessage = "Geçerli bir referans türü seçiniz.")]
        public ReferenceType Type { get; set; } = ReferenceType.Client;

        public int DisplayOrder { get; set; } = 0;
        public bool IsShowOnHome { get; set; } = true;
        public bool IsActive { get; set; } = true;
    }
}

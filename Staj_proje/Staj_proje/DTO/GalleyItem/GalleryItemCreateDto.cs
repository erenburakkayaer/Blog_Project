using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.GalleyItem
{
    public class GalleryItemCreateDto
    {
        [Required(ErrorMessage = "Şirket seçimi zorunludur.")]
        public int CompanyId { get; set; }

        [Required(ErrorMessage = "Galeriye eklenecek medya dosyası zorunludur.")]
        public int FileAssetId { get; set; }

        [StringLength(150, ErrorMessage = "Başlık en fazla 150 karakter olabilir.")]
        public string? Title { get; set; }

        [StringLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir.")]
        public string? Description { get; set; }

        public int DisplayOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public bool IsFeatured { get; set; } = false;
    }
}

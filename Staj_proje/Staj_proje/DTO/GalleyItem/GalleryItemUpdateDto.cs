using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.GalleyItem
{
    public class GalleryItemUpdateDto
    {
        [Required(ErrorMessage = "Medya dosyası (FileAsset) zorunludur.")]
        public int FileAssetId { get; set; }

        [StringLength(150, ErrorMessage = "Başlık en fazla 150 karakter olabilir.")]
        public string? Title { get; set; }

        [StringLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir.")]
        public string? Description { get; set; }

        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
    }
}

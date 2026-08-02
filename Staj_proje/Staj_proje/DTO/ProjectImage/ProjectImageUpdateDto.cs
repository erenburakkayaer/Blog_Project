using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.ProjectImage
{
    public class ProjectImageUpdateDto
    {
        [Required(ErrorMessage = "Medya dosyası (FileAsset) zorunludur.")]
        public int FileAssetId { get; set; }

        [StringLength(150, ErrorMessage = "Alt metin en fazla 150 karakter olabilir.")]
        public string? AltText { get; set; }

        [StringLength(150, ErrorMessage = "Görsel başlığı en fazla 150 karakter olabilir.")]
        public string? Title { get; set; }

        public int DisplayOrder { get; set; }

        public bool IsCover { get; set; }
    }
}

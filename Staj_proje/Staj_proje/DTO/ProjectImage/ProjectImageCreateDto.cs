using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.ProjectImage
{
    public class ProjectImageCreateDto
    {
        [Required(ErrorMessage = "Proje seçimi zorunludur.")]
        public int ProjectId { get; set; }

        [Required(ErrorMessage = "Yüklenecek dosya (FileAsset) seçilmelidir.")]
        public int FileAssetId { get; set; }

        [StringLength(150, ErrorMessage = "Alt metin en fazla 150 karakter olabilir.")]
        public string? AltText { get; set; }

        [StringLength(150, ErrorMessage = "Görsel başlığı en fazla 150 karakter olabilir.")]
        public string? Title { get; set; }

        public int DisplayOrder { get; set; } = 0;

        public bool IsCover { get; set; } = false;
    }
}

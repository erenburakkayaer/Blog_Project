using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.FileAsset
{
    public class FileAssetUpdateDto
    {
        [Required(ErrorMessage = "Orijinal dosya adı boş bırakılamaz.")]
        [StringLength(200, ErrorMessage = "Dosya adı en fazla 200 karakter olabilir.")]
        public string OriginalFileName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Dosya kategorisi belirtilmelidir.")]
        [StringLength(50, ErrorMessage = "Kategori en fazla 50 karakter olabilir.")]
        public string FileCategory { get; set; } = string.Empty;
    }
}

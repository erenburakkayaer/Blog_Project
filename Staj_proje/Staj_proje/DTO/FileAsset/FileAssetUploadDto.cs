using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.FileAsset
{
    public class FileAssetUploadDto
    {
        [Required(ErrorMessage = "Lütfen bir dosya seçiniz.")]
        public IFormFile File { get; set; } = null!;

        [Required(ErrorMessage = "Dosya kategorisi belirtilmelidir.")]
        [StringLength(50, ErrorMessage = "Kategori en fazla 50 karakter olabilir.")]
        public string FileCategory { get; set; } = string.Empty; // Örn: "Resume", "CoverImage", "ProfilePicture"
    }
}

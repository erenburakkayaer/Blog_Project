using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Blog
{
    public class BlogCreateDto
    {
        [Required(ErrorMessage = "Başlık alanı zorunludur.")]
        [StringLength(200, ErrorMessage = "Başlık en fazla 200 karakter olabilir.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Lütfen bir kategori seçiniz.")]
        [Range(1, int.MaxValue, ErrorMessage = "Geçerli bir kategori ID'si girilmelidir.")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "İçerik alanı zorunludur.")]
        public string Content { get; set; } = string.Empty;

        public int? CoverImageAssetId { get; set; }

        public bool IsPublished { get; set; } = false;
    }
}

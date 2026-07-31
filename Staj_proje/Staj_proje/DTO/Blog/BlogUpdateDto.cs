using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Blog
{
    public class BlogUpdateDto
    {

        [Required(ErrorMessage = "Başlık alanı zorunludur.")]
        [StringLength(200, ErrorMessage = "Başlık en fazla 200 karakter olabilir.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "İçerik alanı zorunludur.")]
        public string Content { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Lütfen geçerli bir kategori seçiniz.")]
        public int CategoryId { get; set; }

        public int? CoverImageAssetId { get; set; }

        public bool IsPublished { get; set; }
    }
}

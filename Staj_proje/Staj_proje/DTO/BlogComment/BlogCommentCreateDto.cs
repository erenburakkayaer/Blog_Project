using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.BlogComment
{
    public class BlogCommentCreateDto
    {

        [Required(ErrorMessage = "Yorum içeriği boş olamaz.")]
        [StringLength(1000, ErrorMessage = "Yorum en fazla 1000 karakter olabilir.")]
        public string Content { get; set; } = string.Empty;
        public int? ParentCommentId { get; set; }
    }
}

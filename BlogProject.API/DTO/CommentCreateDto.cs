using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    // Ziyaretçi tarafından doldurulur — IsApproved burada yok, varsayılan false kalır
    public class CommentCreateDto
    {
        [Required]
        public int BlogId { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;
    }
}

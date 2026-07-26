using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    // POST /api/blogs isteğinde kabul edilen alanlar
    // AuthorId burada YOK — yazar her zaman giriş yapan kullanıcıdan (JWT) alınır, client set edemez
    public class BlogCreateDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required, MaxLength(300)]
        public string Summary { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? CoverImage { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        public string Status { get; set; } = "draft";
    }
}

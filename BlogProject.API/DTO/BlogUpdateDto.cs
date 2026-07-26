using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    // PUT /api/blogs/{id} isteğinde kabul edilen alanlar
    public class BlogUpdateDto
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

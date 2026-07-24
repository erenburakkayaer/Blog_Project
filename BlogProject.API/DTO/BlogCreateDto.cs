using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    // POST /api/blogs isteğinde kabul edilen alanlar
    public class BlogCreateDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? CoverImageUrl { get; set; }

        [Required]
        public int AuthorId { get; set; }

        public int? CategoryId { get; set; }
    }
}

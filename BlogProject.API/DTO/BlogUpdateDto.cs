using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    // PUT /api/blogs/{id} isteğinde kabul edilen alanlar
    public class BlogUpdateDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? CoverImageUrl { get; set; }
        public int? CategoryId { get; set; }
        public bool IsPublished { get; set; }
    }
}

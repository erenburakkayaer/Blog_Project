using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    public class ProjectCreateDto
    {
        [Required, MaxLength(120)]
        public string Title { get; set; } = string.Empty;

        [Required, MaxLength(250)]
        public string Summary { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Client { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        public List<string> Technologies { get; set; } = new();

        public string? CoverImage { get; set; }
        public string? ProjectUrl { get; set; }
        public string? RepositoryUrl { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string Status { get; set; } = "draft";
        public bool Featured { get; set; }
    }
}

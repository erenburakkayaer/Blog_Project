namespace Staj_proje.DTOs
{
    // GET işlemleri için (Response)
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string ShortDescription { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? ClientName { get; set; }
        public string? UsedTechnologies { get; set; }
        public DateTime? CompletionDate { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string? ProjectUrl { get; set; }
        public string? CoverImageUrl { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsActive { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<ProjectImageDto> ProjectImages { get; set; } = new HashSet<ProjectImageDto>();
    }

    // CREATE işlemleri için (Request)
    public class CreateProjectDto
    {
        public string Title { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string ShortDescription { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? ClientName { get; set; }
        public string? UsedTechnologies { get; set; }
        public DateTime? CompletionDate { get; set; }
        public int CategoryId { get; set; }
        public string? ProjectUrl { get; set; }
        public int? CoverImageId { get; set; }
        public bool IsFeatured { get; set; }
        public int DisplayOrder { get; set; }
    }

    // UPDATE işlemleri için (Request)
    public class UpdateProjectDto
    {
        public string? Title { get; set; }
        public string? Slug { get; set; }
        public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        public string? ClientName { get; set; }
        public string? UsedTechnologies { get; set; }
        public DateTime? CompletionDate { get; set; }
        public int? CategoryId { get; set; }
        public string? ProjectUrl { get; set; }
        public int? CoverImageId { get; set; }
        public bool? IsFeatured { get; set; }
        public bool? IsActive { get; set; }
        public int? DisplayOrder { get; set; }
    }

    // Galeri görselleri için
    public class ProjectImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = null!;
        public int DisplayOrder { get; set; }
    }
}
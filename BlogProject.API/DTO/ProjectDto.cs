namespace BlogProject.API.DTO
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Client { get; set; } = string.Empty;
        public string? Category { get; set; }
        public List<string> Technologies { get; set; } = new();
        public string? CoverImage { get; set; }
        public string? ProjectUrl { get; set; }
        public string? RepositoryUrl { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool Featured { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}

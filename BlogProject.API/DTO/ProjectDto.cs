namespace BlogProject.API.DTO
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? CategoryId { get; set; }
        public string? ClientName { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}

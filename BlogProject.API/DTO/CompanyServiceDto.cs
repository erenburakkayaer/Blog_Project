namespace BlogProject.API.DTO
{
    public class CompanyServiceDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public int? CategoryId { get; set; }
        public bool IsActive { get; set; }
    }
}

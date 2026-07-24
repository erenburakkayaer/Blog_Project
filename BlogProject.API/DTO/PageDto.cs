namespace BlogProject.API.DTO
{
    public class PageDto
    {
        public int Id { get; set; }
        public string Slug { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime? UpdatedAt { get; set; }
    }
}

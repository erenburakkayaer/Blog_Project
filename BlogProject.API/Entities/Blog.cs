namespace BlogProject.API.Entities
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? CoverImage { get; set; }

        public int AuthorId { get; set; }
        public User? Author { get; set; }

        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        public string Status { get; set; } = "draft"; // "draft" | "published"
        public int ViewCount { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? PublishedAt { get; set; }
    }
}

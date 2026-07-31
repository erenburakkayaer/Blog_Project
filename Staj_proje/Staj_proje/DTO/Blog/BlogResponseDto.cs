namespace Staj_proje.DTO.Blog
{
    public class BlogResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;

        public int AuthorId { get; set; }
        public string AuthorName { get; set; } = string.Empty;

        public int? CoverImageAssetId { get; set; }
        public string? CoverImageUrl { get; set; }

        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CommentCount { get; set; } // Yorum sayısı bilgisi
    }
}

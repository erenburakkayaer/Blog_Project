namespace Staj_proje.DTO.Blog
{
    public class BlogListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty; // User.FirstName + LastName veya Username
        public string CategoryName { get; set; } = string.Empty;
        public string? CoverImageUrl { get; set; } // FileAsset'ten gelen URL
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

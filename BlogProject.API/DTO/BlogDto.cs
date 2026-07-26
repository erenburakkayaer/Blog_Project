namespace BlogProject.API.DTO
{
    // Listeleme / detay için dışarı verilecek güvenli alanlar
    // Alan adları frontend (Samet) ile birebir eşleşecek şekilde seçildi: category, author, status, coverImage
    public class BlogDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? CoverImage { get; set; }
        public string Author { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string Status { get; set; } = string.Empty;
        public int ViewCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? PublishedAt { get; set; }
    }
}

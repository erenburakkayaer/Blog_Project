namespace Staj_proje.Entities
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int AuthorId { get; set; }
        public User Author { get; set; } = null!;
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public int? CoverImageAssetId { get; set; }
        public FileAsset? CoverImageAsset { get; set; } // Kapak görseli isteğe bağlı (nullable) olabilir
        public bool IsPublished { get; set; } = false; // Taslak olarak başlasın, onaylanınca true yapılsın

        // Audit & Soft Delete
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
        public ICollection<BlogComment> BlogComments { get; set; } = new HashSet<BlogComment>();
    }
}

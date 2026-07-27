namespace Staj_proje.Entities
{
    public class ProjectImage
    {
        public int Id { get; set; }

        // Foreign Key & Navigation Property
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        // Görsel Yolu & SEO
        public int FileAssetId { get; set; } // Foreign Key
        public FileAsset FileAsset { get; set; } = null!;
        public string? AltText { get; set; } // SEO ve erişilebilirlik için resim açıklaması
        public string? Title { get; set; }   // Resim başlığı/alt yazısı (opsiyonel)

        // Görsel Mantığı & Sıralama
        public int DisplayOrder { get; set; } = 0; // Galeri içerisindeki sıralama (1. resim, 2. resim...)
        public bool IsCover { get; set; } = false; // Galeri içinden kapak resmi seçildiyse

        // Audit
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }
}

namespace Staj_proje.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Slug { get; set; } = null!; // SEO uyumlu URL için (örn: "ai-powered-crm-system")
        public string ShortDescription { get; set; } = null!; // Kart görünümünde çıkacak kısa özet
        public string Description { get; set; } = null!; // Detay sayfasındaki zengin içerik (HTML/Markdown)

        // Müşteri & Kategori Bilgileri
        public string? ClientName { get; set; } // Örn: "X Holding"
        public string? UsedTechnologies { get; set; } // Örn: ".NET 8, React, PostgreSQL, Docker"
        public DateTime? CompletionDate { get; set; } // Proje bitiş tarihi
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        // Bağlantılar
        public string? ProjectUrl { get; set; } // Canlı demo linki

        // Öne Çıkarılan Görsel (Kapak Fotoğrafı)
        public FileAsset CoverImageUrl { get; set; } = null!;

        // İlan / Gösterim Durumu
        public bool IsFeatured { get; set; } = false; // Ana sayfada öne çıksın mı?
        public bool IsActive { get; set; } = true;
        public int DisplayOrder { get; set; } = 0; // Sıralama önceliği

        // Audit Bilgileri
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;

        // Projeye ait galeri görselleri (One-to-Many)
        public ICollection<ProjectImage> ProjectImages { get; set; }= new HashSet<ProjectImage>();
    }
}

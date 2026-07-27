namespace Staj_proje.Entities
{
    public class CompanyService
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        public string Title { get; set; } = string.Empty; 
        public string ShortDescription { get; set; } = string.Empty;
        public string DetailedDescription { get; set; } = string.Empty; 

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;

        // Durum ve Öne Çıkarma
        public bool IsActive { get; set; } = true;
        public bool IsFeatured { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsDeleted { get; set; } = false;
    }
}

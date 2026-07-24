namespace BlogProject.API.Entities
{
    // Doküman "Services" tablosuna karşılık gelir; .NET DI "service" terimiyle
    // karışmaması için sınıf adı CompanyService seçildi
    public class CompanyService
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? IconUrl { get; set; }
        public int? CategoryId { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

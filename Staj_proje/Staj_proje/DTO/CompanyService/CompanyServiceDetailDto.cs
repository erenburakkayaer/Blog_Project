namespace Staj_proje.DTO.CompanyService
{
    public class CompanyServiceDetailDto
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;
        public string ShortDescription { get; set; } = string.Empty;
        public string DetailedDescription { get; set; } = string.Empty;

        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

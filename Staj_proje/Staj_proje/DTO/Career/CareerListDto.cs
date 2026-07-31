using Staj_proje.Entities;

namespace Staj_proje.DTO.Career
{
    public class CareerListDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? CompanyLogoUrl { get; set; } // Varsa firmanın logosu
        public string Title { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public EmploymentType EmploymentType { get; set; }
        public string Location { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}

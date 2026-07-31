using Staj_proje.Entities;

namespace Staj_proje.DTO.Career
{
    public class CareerDetailDto
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? CompanyLogoUrl { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public EmploymentType EmploymentType { get; set; }
        public string Location { get; set; } = string.Empty;
        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? ExpirationDate { get; set; }

        public int ApplicationCount { get; set; }
    }
}

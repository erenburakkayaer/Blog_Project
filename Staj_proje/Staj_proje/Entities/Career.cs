namespace Staj_proje.Entities
{
    public class Career
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Title { get; set; }= string.Empty;
        public string Description { get; set; } = string.Empty;
        public Category RoleCategory { get; set; } = null!;
        public int CategoryId { get; set; }
        public string EmploymentType { get; set; } = string.Empty;
        public string Location {  get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}

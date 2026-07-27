namespace Staj_proje.Entities
{
    public class Career
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;
        public string Title { get; set; }= string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        public EmploymentType EmploymentType { get; set; }
        public string Location {  get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Application> Applications { get; set; } = new HashSet<Application>();
        // Son Başvuru Tarihi & Soft Delete
        public DateTime? ExpirationDate { get; set; } // İlanın kapanacağı son tarih
        public bool IsDeleted { get; set; } = false;   // İlan silindiğinde başvurular kaybolmasın diye

    }
    public enum EmploymentType
    {
        FullTime = 0,   // Tam Zamanlı
        PartTime = 1,   // Yarı Zamanlı
        Contract = 2,   // Sözleşmeli / Proje Bazlı
        Internship = 3, // Stajyer
        Remote = 4      // Uzaktan / Freelance
    }
}

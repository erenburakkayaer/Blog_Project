namespace BlogProject.API.Entities
{
    // Teklif Al formu
    public class Offer
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int? ServiceId { get; set; }
        public string? Description { get; set; }
        public string? FileUrl { get; set; }

        public string Status { get; set; } = "New"; // New, InProgress, Closed
        public DateTime CreatedAt { get; set; }
    }
}

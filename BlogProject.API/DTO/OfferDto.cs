namespace BlogProject.API.DTO
{
    public class OfferDto
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int? ServiceId { get; set; }
        public string? Description { get; set; }
        public string? FileUrl { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}

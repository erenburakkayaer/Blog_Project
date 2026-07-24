using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    public class OfferCreateDto
    {
        [Required, MaxLength(150)]
        public string CompanyName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string Phone { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        public int? ServiceId { get; set; }
        public string? Description { get; set; }

        // Önce /api/files/upload ile yüklenip dönen URL buraya konur
        public string? FileUrl { get; set; }
    }
}

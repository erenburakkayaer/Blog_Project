using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    public class ApplicationCreateDto
    {
        [Required]
        public int CareerId { get; set; }

        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        // Önce /api/files/upload (CV) ile yüklenip dönen URL buraya konur
        [Required]
        public string CvFileUrl { get; set; } = string.Empty;
    }
}

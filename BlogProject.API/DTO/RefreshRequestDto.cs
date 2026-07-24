using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    public class RefreshRequestDto
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}

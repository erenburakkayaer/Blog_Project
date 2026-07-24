using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    public class UserUpdateDto
    {
        [Required, MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        public int RoleId { get; set; }
        public bool IsActive { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BlogProject.API.DTO
{
    public class UserCreateDto
    {
        [Required, MaxLength(50)]
        [JsonPropertyName("name")]
        public string Username { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        // frontend/samet UserModal.jsx şifre alanı toplamıyor — boş bırakılırsa geçici şifre üretilir
        [MinLength(6)]
        public string? Password { get; set; }

        // frontend "admin"/"editor"/"author" slug gönderiyor (RoleId değil)
        [Required]
        public string Role { get; set; } = "author";
    }
}

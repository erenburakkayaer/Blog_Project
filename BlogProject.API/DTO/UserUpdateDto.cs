using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BlogProject.API.DTO
{
    public class UserUpdateDto
    {
        [Required, MaxLength(50)]
        [JsonPropertyName("name")]
        public string Username { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string Role { get; set; } = "author";

        public string Status { get; set; } = "active"; // "active" | "passive"
    }
}

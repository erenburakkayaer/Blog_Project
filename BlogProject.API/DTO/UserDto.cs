using System.Text.Json.Serialization;

namespace BlogProject.API.DTO
{
    // Dışarı asla PasswordHash gitmez
    public class UserDto
    {
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        [JsonIgnore]
        public int RoleId { get; set; }

        [JsonIgnore]
        public string? RoleName { get; set; }

        [JsonIgnore]
        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }

        // frontend/samet userService.js "admin"/"editor"/"author" slug bekliyor, backend rolleri Türkçe (Admin/Editor/Yazar/SuperAdmin)
        public string Role => RoleName?.ToLowerInvariant() switch
        {
            "yazar" => "author",
            "superadmin" => "admin",
            "admin" => "admin",
            "editor" => "editor",
            _ => "editor"
        };

        // frontend "active"/"passive" string bekliyor, entity'de bool IsActive var
        public string Status => IsActive ? "active" : "passive";
    }
}

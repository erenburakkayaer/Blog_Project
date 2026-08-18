using System.Text.Json.Serialization;

namespace BlogProject.API.DTO
{
    public class MessageDto
    {
        public int Id { get; set; }

        [JsonPropertyName("fullName")]
        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("message")]
        public string Content { get; set; } = string.Empty;

        [JsonIgnore]
        public bool IsRead { get; set; }

        public bool IsImportant { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("reply")]
        public string? ReplyMessage { get; set; }
        public DateTime? RepliedAt { get; set; }

        // frontend/samet messageService.js "unread"/"read" string bekliyor, entity'de bool IsRead var
        public string Status => IsRead ? "read" : "unread";
    }
}

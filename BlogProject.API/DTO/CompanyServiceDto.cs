using System.Text.Json.Serialization;

namespace BlogProject.API.DTO
{
    public class CompanyServiceDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        [JsonPropertyName("icon")]
        public string? IconUrl { get; set; }

        public int? CategoryId { get; set; }

        [JsonIgnore]
        public bool IsActive { get; set; }

        // frontend/samet serviceService.js "active"/"passive" string bekliyor, entity'de bool IsActive var
        public string Status
        {
            get => IsActive ? "active" : "passive";
            set => IsActive = value == "active";
        }
    }
}

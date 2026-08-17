using Staj_proje.Entities;

namespace Staj_proje.DTO.Log
{
    public class LogDetailDto
    {
        public long Id { get; set; }

        public int? UserId { get; set; }
        public string? UserFullName { get; set; }
        public string? UserEmail { get; set; }

        public string EntityName { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public AuditAction Action { get; set; }

        // JSON formatındaki detaylı değişiklikler
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }

        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;

        public string? HttpMethod { get; set; }
        public int? StatusCode { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}

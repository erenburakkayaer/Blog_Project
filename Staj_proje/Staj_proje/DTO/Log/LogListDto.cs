using Staj_proje.Entities;

namespace Staj_proje.DTO.Log
{
    public class LogListDto
    {
        public long Id { get; set; }

        public int? UserId { get; set; }
        public string? UserFullName { get; set; } // İşlemi yapan kullanıcı adı (User.FirstName + LastName)

        public string EntityName { get; set; } = string.Empty;
        public string EntityId { get; set; } = string.Empty;
        public AuditAction Action { get; set; }

        public string IpAddress { get; set; } = string.Empty;
        public string? HttpMethod { get; set; }
        public int? StatusCode { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}

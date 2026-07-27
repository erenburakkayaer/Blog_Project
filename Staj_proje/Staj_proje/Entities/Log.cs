namespace Staj_proje.Entities
{
    public class Log
    {
        public long Id { get; set; }

        // 1. İşlemi Yapan Kullanıcı (Nullable: Giriş yapmamış biri de işlem yapabilir)
        public int? UserId { get; set; }
        public User? User { get; set; }

        // 2. İşlem Detayları
        public string EntityName { get; set; } = string.Empty; // Örn: "Company", "Career", "BlogComment"
        public string EntityId { get; set; } = string.Empty;   // Örn: "15" (İlgili kaydın Primary Key'i)
        public AuditAction Action { get; set; }            // Enum: Create, Update, Delete

        // 3. Değişiklik Detayları (JSON formatında saklanır)
        public string? OldValues { get; set; } // Örn: {"Title": "Eski İlan Başlığı"}
        public string? NewValues { get; set; } // Örn: {"Title": "Yeni İlan Başlığı"}

        // 4. İstemci Bilgileri
        public string IpAddress { get; set; } = string.Empty;  // Örn: "192.168.1.1"
        public string UserAgent { get; set; } = string.Empty;  // Tarayıcı / Cihaz Bilgisi

        // 5. Zaman Damgası
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? HttpMethod { get; set; } // Örn: "GET", "POST", "PUT", "DELETE"
        public int? StatusCode { get; set; } // Örn: 200, 400, 500 // Örn: "200", "400", "500"
    }
    public enum AuditAction
    {
        Create = 1,
        Update = 2,
        Delete = 3,
        Login = 4,
        Logout = 5
    }
}

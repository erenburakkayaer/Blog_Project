namespace BlogProject.API.Entities
{
    // Sistem/işlem logları — API üzerinden yazılmaz, sadece okunur
    public class Log
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string? Details { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

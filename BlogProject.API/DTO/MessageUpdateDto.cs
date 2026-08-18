namespace BlogProject.API.DTO
{
    // Sadece personel kullanır — okundu/önemli/arşiv işaretleme
    // Alanlar nullable: sadece gönderilenler güncellenir (partial update)
    public class MessageUpdateDto
    {
        public string? Status { get; set; } // "read" | "unread"
        public bool? IsImportant { get; set; }
        public bool? IsArchived { get; set; }
    }
}

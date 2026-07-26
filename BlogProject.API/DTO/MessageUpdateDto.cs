namespace BlogProject.API.DTO
{
    // Sadece personel kullanır — okundu/önemli/arşiv işaretleme
    public class MessageUpdateDto
    {
        public bool IsRead { get; set; }
        public bool IsImportant { get; set; }
        public bool IsArchived { get; set; }
    }
}

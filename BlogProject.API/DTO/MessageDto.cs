namespace BlogProject.API.DTO
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public bool IsImportant { get; set; }
        public bool IsArchived { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

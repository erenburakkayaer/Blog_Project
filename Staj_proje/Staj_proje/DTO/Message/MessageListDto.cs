using Staj_proje.Entities;

namespace Staj_proje.DTO.Message
{
    public class MessageListDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;

        public MessageStatus Status { get; set; }
        public bool HasAttachment { get; set; } // Ekli dosya var mı kontrolü (AttachmentFileId != null)

        public DateTime CreatedAt { get; set; }
    }
}

using Staj_proje.Entities;

namespace Staj_proje.DTO.Message
{
    public class MessageDetailDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }

        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;

        public int? UserId { get; set; }
        public string? SenderUserName { get; set; }

        public int? AttachmentFileId { get; set; }
        public string? AttachmentFileUrl { get; set; } // FileAsset'ten gelen indirilebilir URL

        public MessageStatus Status { get; set; }
        public string? AdminNote { get; set; }
        public string? ReplyMessage { get; set; }
        public DateTime? RepliedAt { get; set; }

        public string IpAddress { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}

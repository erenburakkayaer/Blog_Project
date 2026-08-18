using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    public class MessageReplyDto
    {
        [Required, MaxLength(2000)]
        public string ReplyMessage { get; set; } = string.Empty;
    }
}

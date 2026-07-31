using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Message
{
    public class MessageReplyDto
    {
        [Required(ErrorMessage = "Yanıt metni boş bırakılamaz.")]
        public string ReplyMessage { get; set; } = string.Empty;
    }
}

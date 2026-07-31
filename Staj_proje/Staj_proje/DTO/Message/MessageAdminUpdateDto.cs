using Staj_proje.Entities;
using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Message
{
    public class MessageAdminUpdateDto
    {
        [EnumDataType(typeof(MessageStatus), ErrorMessage = "Geçerli bir mesaj durumu seçiniz.")]
        public MessageStatus Status { get; set; }

        [StringLength(500, ErrorMessage = "Yönetici notu en fazla 500 karakter olabilir.")]
        public string? AdminNote { get; set; }
    }
}

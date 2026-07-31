using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Message
{
    public class MessageCreateDto
    {
        [Required(ErrorMessage = "Mesajın gönderileceği şirket seçilmelidir.")]
        public int CompanyId { get; set; }

        [Required(ErrorMessage = "Ad Soyad alanı zorunludur.")]
        [StringLength(100, ErrorMessage = "Ad Soyad en fazla 100 karakter olabilir.")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-posta adresi zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        public string Email { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Geçerli bir telefon numarası giriniz.")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Konu alanı zorunludur.")]
        [StringLength(150, ErrorMessage = "Konu en fazla 150 karakter olabilir.")]
        public string Subject { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mesaj içeriği boş bırakılamaz.")]
        [StringLength(2000, ErrorMessage = "Mesaj metni en fazla 2000 karakter olabilir.")]
        public string Content { get; set; } = string.Empty;

        public int? AttachmentFileId { get; set; }
    }
}

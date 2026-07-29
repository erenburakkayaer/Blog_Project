using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.User
{
    public class ChangeEmailDto
    {
        [Required(ErrorMessage = "Yeni e-posta adresi zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        public string NewEmail { get; set; } = string.Empty;
    }
}

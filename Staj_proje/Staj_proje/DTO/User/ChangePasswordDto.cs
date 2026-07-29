using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.User
{
    public class ChangePasswordDto
    {
        [Required(ErrorMessage = "Mevcut şifre alanı zorunludur.")]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Yeni şifre alanı zorunludur.")]
        [MinLength(8, ErrorMessage = "Yeni şifre en az 8 karakter olmalıdır.")]
        public string NewPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Yeni şifre tekrarı zorunludur.")]
        [Compare("NewPassword", ErrorMessage = "Yeni şifreler birbiriyle uyuşmuyor.")]
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }
}

using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "E-posta adresi zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        public string Email { get; set; } = string.Empty;

        public string? Username { get; set; }

        public string? FullName { get; set; }

        [Required(ErrorMessage = "Parola zorunludur.")]
        [MinLength(6, ErrorMessage = "Parola en az 6 karakter olmalıdır.")]
        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "author";
    }
}

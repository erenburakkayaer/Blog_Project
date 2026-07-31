using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Company
{
    public class CompanyUpdateDto
    {
        [Required(ErrorMessage = "Şirket adı zorunludur.")]
        [StringLength(150, ErrorMessage = "Şirket adı en fazla 150 karakter olabilir.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(250, ErrorMessage = "Slogan en fazla 250 karakter olabilir.")]
        public string? Tagline { get; set; }

        [Required(ErrorMessage = "Şirket açıklaması zorunludur.")]
        public string Description { get; set; } = string.Empty;

        public int? LogoFileAssetId { get; set; }

        [Required(ErrorMessage = "E-posta adresi zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telefon numarası zorunludur.")]
        [Phone(ErrorMessage = "Geçerli bir telefon numarası giriniz.")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Konum bilgisi zorunludur.")]
        [StringLength(200, ErrorMessage = "Konum bilgisi en fazla 200 karakter olabilir.")]
        public string Location { get; set; } = string.Empty;
    }
}

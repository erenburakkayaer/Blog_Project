using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.CompanyService
{
    public class CompanyServiceUpdateDto
    {
        [Required(ErrorMessage = "Hizmet başlığı zorunludur.")]
        [StringLength(150, ErrorMessage = "Hizmet başlığı en fazla 150 karakter olabilir.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kısa açıklama zorunludur.")]
        [StringLength(300, ErrorMessage = "Kısa açıklama en fazla 300 karakter olabilir.")]
        public string ShortDescription { get; set; } = string.Empty;

        [Required(ErrorMessage = "Detaylı açıklama zorunludur.")]
        public string DetailedDescription { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Lütfen geçerli bir kategori seçiniz.")]
        public int CategoryId { get; set; }

        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
    }
}

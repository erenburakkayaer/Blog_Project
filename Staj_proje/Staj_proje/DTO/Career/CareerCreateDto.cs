using Staj_proje.Entities;
using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Career
{
    public class CareerCreateDto
    {
        // Sistemizdeki yetki mimarisine göre CompanyId eklenebilir veya çıkarılabilir.
        [Required(ErrorMessage = "Firma seçimi zorunludur.")]
        public int CompanyId { get; set; }

        [Required(ErrorMessage = "İlan başlığı alanı zorunludur.")]
        [StringLength(150, ErrorMessage = "İlan başlığı en fazla 150 karakter olabilir.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "İlan açıklaması zorunludur.")]
        public string Description { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Lütfen geçerli bir kategori seçiniz.")]
        public int CategoryId { get; set; }

        [EnumDataType(typeof(EmploymentType), ErrorMessage = "Geçerli bir çalışma türü seçiniz.")]
        public EmploymentType EmploymentType { get; set; }

        [Required(ErrorMessage = "Lokasyon bilgisi zorunludur.")]
        [StringLength(100, ErrorMessage = "Lokasyon en fazla 100 karakter olabilir.")]
        public string Location { get; set; } = string.Empty;

        public DateTime? ExpirationDate { get; set; }
    }
}

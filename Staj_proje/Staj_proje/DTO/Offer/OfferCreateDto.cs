using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Offer
{
    public class OfferCreateDto
    {
        [Required(ErrorMessage = "Teklif istenecek şirket seçilmelidir.")]
        public int CompanyId { get; set; }

        public int? CompanyServiceId { get; set; }

        [Required(ErrorMessage = "İletişim kişisi adı zorunludur.")]
        [StringLength(100, ErrorMessage = "Ad Soyad en fazla 100 karakter olabilir.")]
        public string ContactName { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-posta adresi zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
        public string ContactEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telefon numarası zorunludur.")]
        [Phone(ErrorMessage = "Geçerli bir telefon numarası giriniz.")]
        public string ContactPhone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Teklif/Proje başlığı zorunludur.")]
        [StringLength(150, ErrorMessage = "Başlık en fazla 150 karakter olabilir.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "İhtiyaç ve kapsam detayları belirtilmelidir.")]
        [StringLength(3000, ErrorMessage = "İhtiyaç detayları en fazla 3000 karakter olabilir.")]
        public string RequirementDetails { get; set; } = string.Empty;

        public int? RequirementFileId { get; set; }
    }
}

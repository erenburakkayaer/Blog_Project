using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Offer
{
    public class OfferCompanyDto
    {
        [Required(ErrorMessage = "Teklif edilen fiyat belirtilmelidir.")]
        [Range(0, 999999999, ErrorMessage = "Geçerli bir teklif tutarı giriniz.")]
        public decimal OfferedPrice { get; set; }

        [Required(ErrorMessage = "Para birimi seçilmelidir.")]
        [StringLength(10, ErrorMessage = "Para birimi en fazla 10 karakter olabilir.")]
        public string Currency { get; set; } = "TL";

        public string? ProposalNotes { get; set; }

        public int? ProposalFileId { get; set; }

        public DateTime? ValidUntil { get; set; }
    }
}

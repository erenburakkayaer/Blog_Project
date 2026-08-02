using Staj_proje.Entities;
using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Offer
{
    public class OfferStatusUpdateDto
    {
        [EnumDataType(typeof(OfferStatus), ErrorMessage = "Geçerli bir teklif durumu seçiniz.")]
        public OfferStatus Status { get; set; }
    }
}

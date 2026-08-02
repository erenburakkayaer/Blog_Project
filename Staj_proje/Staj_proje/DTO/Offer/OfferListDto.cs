using Staj_proje.Entities;

namespace Staj_proje.DTO.Offer
{
    public class OfferListDto
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;

        public string? CompanyServiceName { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ContactName { get; set; } = string.Empty;

        public decimal? OfferedPrice { get; set; }
        public string Currency { get; set; } = "TL";

        public OfferStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ValidUntil { get; set; }
    }
}

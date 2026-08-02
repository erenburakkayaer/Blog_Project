using Staj_proje.Entities;

namespace Staj_proje.DTO.Offer
{
    public class OfferDetailDto
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;

        public int? CompanyServiceId { get; set; }
        public string? CompanyServiceName { get; set; }

        public int RequesterUserId { get; set; }
        public string RequesterUserName { get; set; } = string.Empty;

        // İletişim Bilgileri
        public string ContactName { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;

        // Müşteri Detayları
        public string Title { get; set; } = string.Empty;
        public string RequirementDetails { get; set; } = string.Empty;

        // Şirket Yanıtı ve Fiyatlandırma
        public decimal? OfferedPrice { get; set; }
        public string Currency { get; set; } = "TL";
        public string? ProposalNotes { get; set; }

        // Dosya Bağlantıları (FileAsset URL Düzleştirmesi)
        public int? RequirementFileId { get; set; }
        public string? RequirementFileUrl { get; set; }

        public int? ProposalFileId { get; set; }
        public string? ProposalFileUrl { get; set; }

        // Durum ve Zaman Bilgileri
        public OfferStatus Status { get; set; }
        public DateTime? ValidUntil { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
    }
}

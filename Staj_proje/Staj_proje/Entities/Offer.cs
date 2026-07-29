namespace Staj_proje.Entities
{
    public class Offer
    {
        public int Id { get; set; }

        // 1. İlişkiler (Foreign Keys)
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        // Hangi hizmet için teklif isteniyor? (Nullable: Genel teklif de olabilir)
        public int? CompanyServiceId { get; set; }
        public CompanyService? CompanyService { get; set; }

        // Teklifi İsteyen Kullanıcı 
        public int RequesterUserId { get; set; }
        public User RequesterUser { get; set; } = null!;

        // 2. İletişim Bilgileri (Anonim talepler veya hızlı iletişim için)
        public string ContactName { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;

        // 3. Teklif Detayları
        public string Title { get; set; } = string.Empty;       // Örn: "AI SIEM Kurulum Projesi"
        public string RequirementDetails { get; set; } = string.Empty; // İhtiyaç/Kapsam metni

        // 4. Fiyatlandırma ve Şartlar (Şirket tarafından doldurulur)
        public decimal? OfferedPrice { get; set; }
        public string Currency { get; set; } = "TL";           // USD, EUR, TRY
        public string? ProposalNotes { get; set; }             // Şirketin cevabı/açıklaması

        // 5. Dosya Eklentileri (Şartname veya Hazırlanan PDF Teklifi)
        public int? RequirementFileId { get; set; }            // Müşterinin yüklediği dosya
        public FileAsset? RequirementFile { get; set; }

        public int? ProposalFileId { get; set; }               // Şirketin hazırlayıp yüklediği PDF
        public FileAsset? ProposalFile { get; set; }

        // 6. Durum Takibi
        public OfferStatus Status { get; set; } = OfferStatus.Pending;
        public DateTime? ValidUntil { get; set; }              // Teklifin son geçerlilik tarihi

        // 7. Zaman Damgaları
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RespondedAt { get; set; }
        public bool IsDeleted { get; set; } = false;
    }

    public enum OfferStatus
    {
        Pending = 1,       // Beklemede / İncelemede
        InReview = 2,      // Teklif Hazırlanıyor
        Sent = 3,          // Teklif Gönderildi
        Accepted = 4,      // Kabul Edildi
        Rejected = 5,      // Reddedildi
        Expired = 6,       // Süresi Doldu (Gözden Geçirilmeli)
        Canceled = 7       // İptal Edildi
    }
}

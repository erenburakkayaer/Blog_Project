namespace Staj_proje.Entities
{
    public class Reference
    {
        public int Id { get; set; }

        // Referans Firma Bilgileri
        public string Name { get; set; } = string.Empty; // Örn: "X Holding", "Y Teknoloji"
        public int LogoFileAssetId { get; set; }
        public FileAsset LogoFileAsset { get; set; } = null!;
        public string? WebsiteUrl { get; set; } // Referansın web sitesi linki (Örn: "https://example.com")
        public string? Sector { get; set; } // Örn: "Fintech", "E-Ticaret", "Sağlık"

        // Referans Türü (İş Ortağı mı, Müşteri mi?)
        public ReferenceType Type { get; set; } = ReferenceType.Client;

        // Görünüm & Sıralama Ayarları
        public int DisplayOrder { get; set; } = 0; // Admin panelinde logo sırasını belirlemek için
        public bool IsShowOnHome { get; set; } = true; // Ana sayfadaki logo bandında çıksın mı?
        public bool IsActive { get; set; } = true;

        // Audit Bilgileri
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }

    public enum ReferenceType
    {
        Client = 0,     // Hizmet Verilen Müşteri
        Partner = 1,    // Çözüm / İş Ortağı (Örn: AWS, Microsoft Partner)
        Sponsor = 2     // Sponsor
    }
}

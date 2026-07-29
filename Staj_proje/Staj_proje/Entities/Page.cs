using System.ComponentModel.DataAnnotations;

namespace Staj_proje.Entities
{
    public class Page
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty; // Sayfa Başlığı

        public string Slug { get; set; } = string.Empty; // URL yolu (örn: "hakkimizda", "siber-guvenlik-danismanligi")

        public string? Summary { get; set; } // Kısa özet/spot metin

        public string? Content { get; set; } // Zengin HTML/Markdown İçerik (WYSIWYG Editör)

        public PageType Type { get; set; } = PageType.Standard; // Sayfa Türü

        public bool IsActive { get; set; } = true;

        public bool ShowInHeader { get; set; } = true; // Menüde görünsün mü?
        public bool ShowInFooter { get; set; } = false; // Alt menüde görünsün mü?

        public int DisplayOrder { get; set; } = 0; // Sıralama

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // --- İlişkiler (Foreign Keys & Navigation Properties) ---

        // SEO Ayarları İlişkisi 
        public int? SeoSettingId { get; set; }
        public SeoSetting? SeoSetting { get; set; }

        // Öne Çıkan Görsel / Banner (Görselinizdeki FileAsset.cs ile)
        public int? BannerImageAssetId { get; set; }
        public FileAsset? BannerImageAsset { get; set; }
        public bool IsDeleted { get; set; } = false;

    }

    public enum PageType
    {
        Standard = 0,    // Genel Statik Sayfa (Hakkımızda, Gizlilik vb.)
        Service = 1,     // Hizmet Sayfası (Yapay Zeka, Siber Güvenlik detay)
        Contact = 2,     // İletişim Sayfası
        LandingPage = 3  // Özel Kampanya / Tanıtım Sayfası
    }
}


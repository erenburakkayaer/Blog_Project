namespace Staj_proje.Entities
{
    public class Slider
    {
        public int Id { get; set; }

        // Metin İçerikleri
        public string? Title { get; set; } = string.Empty; // Slider başlığı
        public string? Subtitle { get; set; } = string.Empty;       // Alt başlık / spot metin

        // Masaüstü Görseli 
        public int ImageFileAssetId { get; set; }
        public FileAsset ImageFileAsset { get; set; } = null!;
        // Buton / Yönlendirme (Call to Action)
        public string? ButtonText { get; set; } = string.Empty; // Örn: "Projelere Göz At"
        public string? ButtonUrl { get; set; } = string.Empty;  // Örn: "/projects"
        public bool OpenInNewTab { get; set; } = true;

        // Görünüş & Sıralama
        public int DisplayOrder { get; set; } = 0; // Slider geçiş sırası
        public bool IsActive { get; set; } = true;

        // Audit Bilgileri
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }
}

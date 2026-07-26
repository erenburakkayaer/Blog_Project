namespace Staj_proje.Entities
{
    public class GalleryItem
    {
        public int Id { get; set; }

        // 1. Şirket Bağlantısı (Foreign Key)
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        // 2. Medya Dosyası Bağlantısı (FileAsset Foreign Key)
        public int FileAssetId { get; set; }
        public FileAsset FileAsset { get; set; } = null!;

        // 3. İçerik ve Açıklama Bilgileri
        public string Title { get; set; } = string.Empty; // Örn: "Yeni Ofis Alanımız" veya "YZ Projesi Ekran Görüntüsü"
        public string? Description { get; set; }          // Detaylı alt yazı / açıklama
        // 6. Sıralama ve Görünürlük Kontrolleri
        public int DisplayOrder { get; set; } = 0; // Fotoğrafların galeri slider/grid içindeki sıralaması
        public bool IsActive { get; set; } = true;
        public bool IsFeatured { get; set; } = false; // Şirketin ana sayfasında/öne çıkanlarda gösterilsin mi?

        // 7. Zaman Damgaları
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

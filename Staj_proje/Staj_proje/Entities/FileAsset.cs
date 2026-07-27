namespace Staj_proje.Entities
{
    public class FileAsset
    {
        public int Id { get; set; }

        // 1. Dosya Kimlik ve Ad Bilgileri
        public string OriginalFileName { get; set; } = string.Empty; 
        public string StoredFileName { get; set; } = string.Empty;  //(Çakışmayı önlemek için GUID)

        // 2. Depolama ve Yolu
        public string FilePath { get; set; } = string.Empty;         // Örn: "/uploads/resumes/2026/07/" veya S3 URL
        public string ContentType { get; set; } = string.Empty;      // Örn: "application/pdf", "image/png"
        public long FileSizeBytes { get; set; }                      // Örn: 2048576 (Byte cinsinden boyut)

        // 3. Dosyanın Amacı / Türü
        public string FileCategory { get; set; }=string.Empty;

        // 4. Mülkiyet (Dosyayı Yükleyen Kullanıcı)
        public int UploadedByUserId { get; set; }
        public User UploadedByUser { get; set; } = null!;

        // 5. Zaman Damgası
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }
}

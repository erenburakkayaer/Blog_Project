namespace Staj_proje.Entities
{
    public class RefreshToken
    {
        // Primary Key
        public int Id { get; set; }

        // Foreign Key & Navigation Property (User İlişkisi)
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Token Değeri (Kriptografik olarak üretilmiş rastgele string / GUID / Base64)
        public string Token { get; set; } = string.Empty;

        // Zaman & Geçerlilik Bilgileri
        public DateTime ExpiresAt { get; set; } // Token ne zaman sonlanacak? (Örn: CreatedAt + 7 Gün)
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? CreatedByIp { get; set; } // Token hangi IP adresinden oluşturuldu?

        // İptal (Revoke) Bilgileri (Siber güvenlik ve Oturum Yönetimi için)
        public DateTime? RevokedAt { get; set; } // Oturum kapatıldıysa veya token geçersiz kılındıysa ne zaman yapıldı?
        public string? RevokedByIp { get; set; } // Hangi IP'den oturum kapatıldı?
        public string? ReplacedByToken { get; set; } // Token Rotation (Güvenlik için token yenilendiğinde yeni token değeri)

        // Durum Mantıkları (Properties)
        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
        public bool IsRevoked => RevokedAt != null;
        public bool IsActive => !IsRevoked && !IsExpired;
    }
}

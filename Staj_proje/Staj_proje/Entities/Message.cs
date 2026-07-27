namespace Staj_proje.Entities
{
    public class Message
    {
        public int Id { get; set; }

        // 1. Şirket Bağlantısı (Foreign Key)
        // Mesaj hangi şirkete/firmaya gönderildi?
        public int CompanyId { get; set; }
        public Company Company { get; set; } = null!;

        // 2. Formu Dolduran Kişinin Bilgileri
        public string FullName { get; set; } = string.Empty; // Ad Soyad
        public string Email { get; set; } = string.Empty;    // E-posta adresi (Yanıt dönmek için)
        public string? Phone { get; set; }                  // Telefon (Opsiyonel)

        // 3. Mesaj İçeriği
        public string Subject { get; set; } = string.Empty;  // Mesaj Konusu (Örn: "Siber Güvenlik Hizmet Teklifi")
        public string Content { get; set; } = string.Empty;  // Mesaj Metni

        // 4. İsteğe Bağlı: Giriş Yapmış Kullanıcı (Nullable)
        // Eğer mesajı atan kişi sitede oturum açmış bir üye/aday ise ID'si tutulur, anonim ise null kalır.
        public int? UserId { get; set; }
        public User? User { get; set; }

        // 5. İsteğe Bağlı: Dosya Eklentisi (Nullable)
        // İletişim formundan dosya/şartname/RFP yüklenmesine izin veriliyorsa
        public int? AttachmentFileId { get; set; }
        public FileAsset? AttachmentFile { get; set; }

        // 6. Mesaj Durum ve Yanıt Takibi (Yönetici / İK Paneli İçin)
        public MessageStatus Status { get; set; } = MessageStatus.New;
        public string? AdminNote { get; set; }             // Şirket içi not (Örn: "Ahmet Bey ilgilendi, teklif atıldı.")
        public string? ReplyMessage { get; set; }          // Gönderilen yanıt metni
        public DateTime? RepliedAt { get; set; }           // Yanıtlanma tarihi

        // 7. İstemci Bilgileri (Spam / Güvenlik Takibi)
        public string IpAddress { get; set; } = string.Empty;

        // 8. Zaman Damgası
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }

    public enum MessageStatus
    {
        New = 1,         // Yeni / Okunmadı
        Read = 2,        // Okundu / İncelemede
        Replied = 3,     // Yanıtlandı (E-posta gönderildi)
        Archived = 4,    // Arşivlendi
        Spam = 5         // Spam olarak işaretlendi
    }
}

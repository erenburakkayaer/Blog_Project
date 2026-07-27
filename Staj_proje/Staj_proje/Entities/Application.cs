using System.ComponentModel.DataAnnotations.Schema;

namespace Staj_proje.Entities
{
    public class Application
    {
        public int Id { get; set; }

        // Foreign Key & Navigation Property (Career / İlan İlişkisi)
        // Adayın başvurduğu açık pozisyon (null ise genel başvuru kabul edilebilir)
        public int? CareerId { get; set; }
        public Career Career { get; set; }
        //Başvuran
        public int? UserId { get; set; }
        public User User { get; set; }

        // B) Başvuruyu İnceleyen / İşlem Yapan Yönetici veya İK Personeli
        public int? ReviewedByUserId { get; set; }
        public User? ReviewedByUser { get; set; }
        //Başvuranın hesapları
        public string LinkedInUrl { get; set; } = string.Empty;
        public string GitHubUrl { get; set; } = string.Empty;
        public string PortfolioUrl { get; set; } = string.Empty;

        // Başvuru Detayları
        public string CoverLetter { get; set; } = string.Empty; // Ön yazı / Mesaj
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? ExpectedSalary { get; set; } // Maaş beklentisi
        public string ResumeFilePath { get; set; } = string.Empty; // Yüklenen CV dosya yolu (PDF vb.)

        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

        // İnceleyen Yönetici/IK Notları (Admin Panel için)
        public string AdminNotes { get; set; } = string.Empty;

        // Audit & Zaman Bilgileri
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }
        public bool IsDeleted { get; set; } = false; // Soft Delete
    }
    public enum ApplicationStatus
    {
        Pending = 0,     // Yeni/Beklemede
        InReview = 1,    // İnceleniyor
        Shortlisted = 2, // Mülakata Seçildi
        Rejected = 3,    // Reddedildi
        Hired = 4        // İşe Alındı
    }
}

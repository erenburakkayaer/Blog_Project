namespace Staj_proje.DTO.Application
{
    public class ApplicationResponseDto
    {
        public int Id { get; set; }

        // İlan Bilgileri
        public int CareerId { get; set; }
        public string CareerTitle { get; set; } = string.Empty; // İlanın Adı (Örn: "Junior Backend Developer")

        // Başvuran Kullanıcı Bilgisi 
        public int? UserId { get; set; }
        public string? ApplicantName { get; set; } // Başvuranın Adı Soyadı veya Kullanıcı Adı

        // Sosyal Medya & Bağlantılar
        public string? LinkedInUrl { get; set; }
        public string? GitHubUrl { get; set; }
        public string? PortfolioUrl { get; set; }

        // Detaylar & Özgeçmiş
        public string? CoverLetter { get; set; }
        public string ResumeFilePath { get; set; } = string.Empty;

        // Statü & Zaman Bilgileri
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}

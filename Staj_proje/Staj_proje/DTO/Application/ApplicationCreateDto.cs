using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Application
{
    public class ApplicationCreateDto
    {
        public int CareerId { get; set; }

        // Adayın profillerine ait sosyal medya/portföy linkleri (Opsiyonel)
        [Url(ErrorMessage = "Geçerli bir LinkedIn adresi giriniz.")]
        public string? LinkedInUrl { get; set; }

        [Url(ErrorMessage = "Geçerli bir GitHub adresi giriniz.")]
        public string? GitHubUrl { get; set; }

        [Url(ErrorMessage = "Geçerli bir Portfolio adresi giriniz.")]
        public string? PortfolioUrl { get; set; }

        // Ön Yazı (Opsiyonel veya projenizin kuralına göre zorunlu yapılabilir)
        [MaxLength(2000, ErrorMessage = "Ön yazı en fazla 2000 karakter olabilir.")]
        public string? CoverLetter { get; set; }

        // Yüklenen CV dosyasının yolu veya sunucudaki kayıt adı
        [Required(ErrorMessage = "Özgeçmiş (CV) yüklemesi zorunludur.")]
        public string ResumeFilePath { get; set; } = string.Empty;
    }
}

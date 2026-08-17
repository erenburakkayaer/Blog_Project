using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Application
{
    public class ApplicationUpdateDto
    {

        [Url(ErrorMessage = "Geçerli bir LinkedIn adresi giriniz.")]
        public string? LinkedInUrl { get; set; }

        [Url(ErrorMessage = "Geçerli bir GitHub adresi giriniz.")]
        public string? GitHubUrl { get; set; }

        [Url(ErrorMessage = "Geçerli bir Portfolio adresi giriniz.")]
        public string? PortfolioUrl { get; set; }

        public string? CoverLetter { get; set; }

        public string? ResumeFilePath { get; set; }

    }
}

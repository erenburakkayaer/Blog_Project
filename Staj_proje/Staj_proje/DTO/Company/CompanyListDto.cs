namespace Staj_proje.DTO.Company
{
    public class CompanyListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Tagline { get; set; }
        public string? LogoUrl { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Kart üzerinde gösterilebilecek aktif ilan sayısı
        public int ActiveCareersCount { get; set; }
    }
}

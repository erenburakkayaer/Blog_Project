namespace Staj_proje.DTO.Company
{
    public class CompanyDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Tagline { get; set; }
        public string Description { get; set; } = string.Empty;

        public int? LogoFileAssetId { get; set; }
        public string? LogoUrl { get; set; }

        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;

        // Bağlı entity'ler için özet sayaçlar
        public int EmployeeCount { get; set; }
        public int ActiveCareersCount { get; set; }
        public int ServicesCount { get; set; }

        // Galeri görsellerinin URL listesi
        public List<string> GalleryImageUrls { get; set; } = new();
    }
}

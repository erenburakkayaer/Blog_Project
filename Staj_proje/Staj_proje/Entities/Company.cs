namespace Staj_proje.Entities
{
    public class Company
    {
        public int Id { get; set; }

        // 1. Temel Kurumsal Bilgiler
        public string Name { get; set; } = string.Empty; // Örn: "CyberAI Teknoloji A.Ş."
        public string? Tagline { get; set; } // Slogan: "Yapay Zeka Destekli Siber Güvenlik Çözümleri"
        public string Description { get; set; } = string.Empty; // Şirket Hakkında Detaylı Metin

        // 2. İletişim Bilgileri
        public string Email { get; set; } = string.Empty; // Kurumsal E-posta
        public string Phone { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;

        public ICollection<User> Employees { get; set; } = new List<User>(); // Şirket Çalışanları / Yöneticileri
        public ICollection<Career> Careers { get; set; } = new List<Career>(); // Açtığı İş İlanları
        public ICollection<CompanyService> Services { get; set; } = new List<CompanyService>(); // Sunduğu Hizmetler
        public ICollection<Message> ContactMessages { get; set; } = new List<Message>();
        public ICollection<Offer> ServiceOffers { get; set; } = new List<Offer>();
    }
}


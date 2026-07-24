namespace BlogProject.API.Entities
{
    // Referanslar / iş ortakları
    public class Reference
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? WebsiteUrl { get; set; }
    }
}

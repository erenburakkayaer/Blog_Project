namespace BlogProject.API.Entities
{
    public class SeoSetting
    {
        public int Id { get; set; }
        public string PageKey { get; set; } = string.Empty;
        public string MetaTitle { get; set; } = string.Empty;
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
    }
}

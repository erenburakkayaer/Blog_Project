namespace BlogProject.API.Entities
{
    // Blog / Hizmet / Proje kategorileri ortak tabloda tutuluyor, Type alanı ile ayrışıyor
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Blog" | "Service" | "Project"

        public ICollection<Blog> Blogs { get; set; } = new List<Blog>();
        public ICollection<Project> Projects { get; set; } = new List<Project>();
        public ICollection<CompanyService> CompanyServices { get; set; } = new List<CompanyService>();
    }
}

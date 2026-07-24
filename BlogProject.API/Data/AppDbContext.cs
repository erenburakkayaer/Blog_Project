using Microsoft.EntityFrameworkCore;
using BlogProject.API.Entities;

namespace BlogProject.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Blog> Blogs { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<Permission> Permissions { get; set; } = null!;
        public DbSet<Page> Pages { get; set; } = null!;
        public DbSet<Slider> Sliders { get; set; } = null!;
        public DbSet<CompanyService> Services { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<ProjectImage> ProjectImages { get; set; } = null!;
        public DbSet<Reference> References { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Comment> Comments { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<Offer> Offers { get; set; } = null!;
        public DbSet<Career> Careers { get; set; } = null!;
        public DbSet<Application> Applications { get; set; } = null!;
        public DbSet<GalleryItem> Gallery { get; set; } = null!;
        public DbSet<FileAsset> Files { get; set; } = null!;
        public DbSet<Setting> Settings { get; set; } = null!;
        public DbSet<SeoSetting> SeoSettings { get; set; } = null!;
        public DbSet<Log> Logs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            DbSeeder.Seed(modelBuilder);
        }
    }
}

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Data
{
    public class AppDbContext : IdentityDbContext<User, Role, int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // --- DbSets ---
        public DbSet<Application> Applications { get; set; } = null!;
        public DbSet<Blog> Blogs { get; set; } = null!;
        public DbSet<BlogComment> BlogComments { get; set; } = null!;
        public DbSet<Career> Careers { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Company> Companies { get; set; } = null!;
        public DbSet<CompanyService> CompanyServices { get; set; } = null!;
        public DbSet<FileAsset> FileAssets { get; set; } = null!;
        public DbSet<GalleryItem> GalleryItems { get; set; } = null!;
        public DbSet<Log> Logs { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<Offer> Offers { get; set; } = null!;
        public DbSet<Page> Pages { get; set; } = null!;
        public DbSet<Permission> Permissions { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<ProjectImage> ProjectImages { get; set; } = null!;
        public DbSet<Reference> References { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<RolePermission> RolePermissions { get; set; } = null!;
        public DbSet<SeoSetting> SeoSettings { get; set; } = null!;
        public DbSet<Slider> Sliders { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); // Identity varsayılan ayarları için şarttır
                                           // ISoftDelete uygulayan tüm Entity'leri bul ve filtreyi otomatik uygula
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                // Entity null değilse ve ISoftDelete arayüzünü uyguluyorsa
                if (typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
                {
                    var parameter = System.Linq.Expressions.Expression.Parameter(entityType.ClrType, "e");
                    var property = System.Linq.Expressions.Expression.Property(parameter, nameof(ISoftDelete.IsDeleted));
                    var falseConstant = System.Linq.Expressions.Expression.Constant(false);
                    var lambda = System.Linq.Expressions.Expression.Lambda(System.Linq.Expressions.Expression.Equal(property, falseConstant), parameter);

                    builder.Entity(entityType.ClrType).HasQueryFilter(lambda);
                }
            }

            // ==========================================
            // 1. KÖPRÜ (JUNCTION) TABLO YAPILANDIRMALARI
            // ==========================================

            // RolePermission (Çoka-Çok İlişki Kompozit Anahtarı)
            builder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            builder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId);



            // Application -> User (Başvuran) ve ReviewedByUser (İnceleyen İK)
            builder.Entity<Application>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Application>()
                .HasOne(a => a.ReviewedByUser)
                .WithMany()
                .HasForeignKey(a => a.ReviewedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Offer -> RequesterUser
            builder.Entity<Offer>()
                .HasOne(o => o.RequesterUser)
                .WithMany()
                .HasForeignKey(o => o.RequesterUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Offer -> RequirementFile / ProposalFile
            builder.Entity<Offer>()
                .HasOne(o => o.RequirementFile)
                .WithMany()
                .HasForeignKey(o => o.RequirementFileId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Offer>()
                .HasOne(o => o.ProposalFile)
                .WithMany()
                .HasForeignKey(o => o.ProposalFileId)
                .OnDelete(DeleteBehavior.Restrict);

            // BlogComment -> Self Reference (Parent / Child)
            builder.Entity<BlogComment>()
                .HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);


            // Decimal alanlar için SQL Server tipi belirleme
            builder.Entity<Offer>()
                .Property(o => o.OfferedPrice)
                .HasPrecision(18, 2);

        }
    }
}
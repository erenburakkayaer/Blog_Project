using Microsoft.EntityFrameworkCore;
using BlogProject.API.Entities;

namespace BlogProject.API.Data
{
    // Code-First seed data: HasData ile migration'a gömülür, "dotnet ef database update"
    // çalıştırıldığında otomatik eklenir. Burada elle bir DB'ye yazma yapılmaz.
    public static class DbSeeder
    {
        // Sabit tarih kullanılıyor çünkü HasData migration'a "gömülen" statik bir değer bekler,
        // DateTime.UtcNow her migration oluşturmada farklı sonuç üretir.
        private static readonly DateTime SeedDate = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        // Varsayılan admin şifresi: "Admin123!" — ilk girişten sonra mutlaka değiştirilmeli.
        // Helpers/PasswordHasher.Hash("Admin123!") ile üretildi (PBKDF2, salt sabit değil ama
        // burada migration'a gömülecek sabit bir hash olduğu için önceden hesaplanmış hali kullanılıyor).
        private const string SeedAdminPasswordHash =
            "iB4Yvj4TzjKnFpjWpQo/yA==.oFW+NPnjtdHiCBkKYNIdD50boXqgya9uL1q8J5W/04A=";

        public static void Seed(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "SuperAdmin" },
                new Role { Id = 2, Name = "Admin" },
                new Role { Id = 3, Name = "Editor" },
                new Role { Id = 4, Name = "Yazar" }
            );

            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                Username = "admin",
                Email = "admin@firmaadi.com",
                PasswordHash = SeedAdminPasswordHash,
                RoleId = 1,
                IsActive = true,
                CreatedAt = SeedDate
            });

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Teknoloji", Slug = "teknoloji", Type = "Blog" },
                new Category { Id = 2, Name = "Web Yazılımı", Slug = "web-yazilimi", Type = "Service" },
                new Category { Id = 3, Name = "Mobil Uygulama", Slug = "mobil-uygulama", Type = "Project" }
            );
        }
    }
}

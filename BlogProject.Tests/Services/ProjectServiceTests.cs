using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Repositories;
using BlogProject.API.Services;

namespace BlogProject.Tests.Services
{
    public class ProjectServiceTests
    {
        private static ProjectService CreateService(out BlogProject.API.Data.AppDbContext context)
        {
            context = TestHelpers.CreateContext();
            var projectRepository = new ProjectRepository(context);
            var categoryRepository = new GenericRepository<Category>(context);
            return new ProjectService(projectRepository, categoryRepository, TestHelpers.CreateMapper());
        }

        [Fact]
        public async Task CreateAsync_SlugUretirVeTeknolojileriKorur()
        {
            var service = CreateService(out _);

            var dto = new ProjectCreateDto
            {
                Title = "Kurumsal Web Platformu",
                Summary = "Kısa bir özet metni burada.",
                Description = "Detaylı açıklama metni burada.",
                Client = "Nova Teknoloji",
                Category = "Web",
                Technologies = new List<string> { "React", "ASP.NET Core" },
                Status = "published"
            };

            var created = await service.CreateAsync(dto);

            Assert.Equal("kurumsal-web-platformu", created.Slug);
            Assert.Equal("Web", created.Category);
            Assert.Equal(2, created.Technologies.Count);
            Assert.Contains("ASP.NET Core", created.Technologies);
        }

        [Fact]
        public async Task CreateAsync_AyniKategoriyiTekrarOlusturmaz()
        {
            var service = CreateService(out var context);

            await service.CreateAsync(new ProjectCreateDto
            {
                Title = "Proje A",
                Summary = "Kısa bir özet metni burada.",
                Description = "Detaylı açıklama.",
                Client = "Müşteri A",
                Category = "Mobil",
                Technologies = new List<string> { "React Native" }
            });
            await service.CreateAsync(new ProjectCreateDto
            {
                Title = "Proje B",
                Summary = "Kısa bir özet metni burada.",
                Description = "Detaylı açıklama.",
                Client = "Müşteri B",
                Category = "mobil",
                Technologies = new List<string> { "Flutter" }
            });

            Assert.Single(context.Categories);
        }

        [Fact]
        public async Task UpdateAsync_FeaturedVeStatusGuncellenebilir()
        {
            var service = CreateService(out _);
            var created = await service.CreateAsync(new ProjectCreateDto
            {
                Title = "Proje",
                Summary = "Kısa bir özet metni burada.",
                Description = "Detaylı açıklama.",
                Client = "Müşteri",
                Category = "Web",
                Technologies = new List<string> { "React" }
            });

            await service.UpdateAsync(created.Id, new ProjectUpdateDto
            {
                Title = "Proje",
                Summary = "Kısa bir özet metni burada.",
                Description = "Detaylı açıklama.",
                Client = "Müşteri",
                Category = "Web",
                Technologies = new List<string> { "React" },
                Status = "published",
                Featured = true
            });

            var updated = await service.GetByIdAsync(created.Id);
            Assert.Equal("published", updated!.Status);
            Assert.True(updated.Featured);
        }
    }
}

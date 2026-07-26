using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Repositories;
using BlogProject.API.Services;

namespace BlogProject.Tests.Services
{
    public class BlogServiceTests
    {
        private const int AuthorId = 1;

        private static BlogService CreateService(out BlogProject.API.Data.AppDbContext context)
        {
            context = TestHelpers.CreateContext();

            // BlogRepository sorguları Author'ı Include ediyor; gerçek bir SQL Server'da
            // AuthorId zaten var olan bir User'a FK ile bağlı olmak zorunda olurdu — testte de
            // aynı bütünlüğü sağlamak için önce bir Role + User (Id=1) oluşturuluyor
            context.Roles.Add(new Role { Id = 1, Name = "Yazar" });
            context.Users.Add(new User { Id = AuthorId, Username = "yazar", Email = "yazar@a.com", PasswordHash = "x", RoleId = 1, CreatedAt = DateTime.UtcNow });
            context.SaveChanges();

            var blogRepository = new BlogRepository(context);
            var categoryRepository = new GenericRepository<Category>(context);
            return new BlogService(blogRepository, categoryRepository, TestHelpers.CreateMapper());
        }

        [Fact]
        public async Task CreateAsync_SlugUretir_VeYazarBilgisiniDoluyor()
        {
            var service = CreateService(out _);

            var dto = new BlogCreateDto { Title = "Merhaba Dünya", Summary = "Kısa bir özet metni burada.", Content = "İçerik", Category = "Web" };
            var created = await service.CreateAsync(dto, AuthorId);

            Assert.Equal("merhaba-dunya", created.Slug);
            Assert.Equal("draft", created.Status);
            Assert.Equal("yazar", created.Author);
            Assert.Equal("Web", created.Category);
        }

        [Fact]
        public async Task UpdateAsync_YayinaAlinca_PublishedAtDoluyor()
        {
            var service = CreateService(out _);
            var created = await service.CreateAsync(
                new BlogCreateDto { Title = "Test", Summary = "Kısa bir özet metni burada.", Content = "İçerik", Category = "Web" },
                AuthorId);

            var updateDto = new BlogUpdateDto { Title = "Test", Summary = "Kısa bir özet metni burada.", Content = "İçerik", Category = "Web", Status = "published" };
            await service.UpdateAsync(created.Id, updateDto);

            var updated = await service.GetByIdAsync(created.Id);
            Assert.NotNull(updated!.PublishedAt);
        }

        [Fact]
        public async Task GetByIdAsync_HerCagrida_ViewCountArtirir()
        {
            var service = CreateService(out _);
            var created = await service.CreateAsync(
                new BlogCreateDto { Title = "Test", Summary = "Kısa bir özet metni burada.", Content = "İçerik", Category = "Web" },
                AuthorId);

            await service.GetByIdAsync(created.Id);
            var second = await service.GetByIdAsync(created.Id);

            Assert.Equal(2, second!.ViewCount);
        }

        [Fact]
        public async Task GetPagedAsync_BaslikaGoreArama_EslesenSonucDoner()
        {
            var service = CreateService(out _);
            await service.CreateAsync(
                new BlogCreateDto { Title = "ASP.NET Core Rehberi", Summary = "Kısa bir özet metni burada.", Content = "İçerik", Category = "Web" },
                AuthorId);
            await service.CreateAsync(
                new BlogCreateDto { Title = "React ile Frontend", Summary = "Kısa bir özet metni burada.", Content = "İçerik", Category = "Web" },
                AuthorId);

            var result = await service.GetPagedAsync(page: 1, pageSize: 10, search: "ASP.NET");

            Assert.Single(result.Items);
            Assert.Equal("ASP.NET Core Rehberi", result.Items.First().Title);
        }

        [Fact]
        public async Task CreateAsync_AyniKategoriIkinciKezVerilirse_YeniKategoriOlusturmaz()
        {
            var service = CreateService(out var context);

            await service.CreateAsync(
                new BlogCreateDto { Title = "Birinci Yazı", Summary = "Kısa bir özet metni burada.", Content = "İçerik", Category = "Web" },
                AuthorId);
            await service.CreateAsync(
                new BlogCreateDto { Title = "İkinci Yazı", Summary = "Kısa bir özet metni burada.", Content = "İçerik", Category = "web" },
                AuthorId);

            Assert.Single(context.Categories);
        }
    }
}

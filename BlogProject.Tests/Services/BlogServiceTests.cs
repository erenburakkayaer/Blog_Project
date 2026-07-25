using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Repositories;
using BlogProject.API.Services;

namespace BlogProject.Tests.Services
{
    public class BlogServiceTests
    {
        private static BlogService CreateService(out BlogProject.API.Data.AppDbContext context)
        {
            context = TestHelpers.CreateContext();

            // BlogRepository sorguları Author'ı Include ediyor; gerçek bir SQL Server'da
            // AuthorId zaten var olan bir User'a FK ile bağlı olmak zorunda olurdu — testte de
            // aynı bütünlüğü sağlamak için önce bir Role + User (Id=1) oluşturuluyor
            context.Roles.Add(new Role { Id = 1, Name = "Yazar" });
            context.Users.Add(new User { Id = 1, Username = "yazar", Email = "yazar@a.com", PasswordHash = "x", RoleId = 1, CreatedAt = DateTime.UtcNow });
            context.SaveChanges();

            var repository = new BlogRepository(context);
            return new BlogService(repository, TestHelpers.CreateMapper());
        }

        [Fact]
        public async Task CreateAsync_SlugUretir_VeYayinlanmamisBaslar()
        {
            var service = CreateService(out _);

            var dto = new BlogCreateDto { Title = "Merhaba Dünya", Content = "İçerik", AuthorId = 1 };
            var created = await service.CreateAsync(dto);

            Assert.Equal("merhaba-dünya", created.Slug);
            Assert.False(created.IsPublished);
        }

        [Fact]
        public async Task UpdateAsync_YayinaAlinca_PublishedAtDoluyor()
        {
            var service = CreateService(out _);
            var created = await service.CreateAsync(new BlogCreateDto { Title = "Test", Content = "İçerik", AuthorId = 1 });

            var updateDto = new BlogUpdateDto { Title = "Test", Content = "İçerik", IsPublished = true };
            await service.UpdateAsync(created.Id, updateDto);

            var updated = await service.GetByIdAsync(created.Id);
            Assert.NotNull(updated!.PublishedAt);
        }

        [Fact]
        public async Task GetByIdAsync_HerCagrida_ViewCountArtirir()
        {
            var service = CreateService(out _);
            var created = await service.CreateAsync(new BlogCreateDto { Title = "Test", Content = "İçerik", AuthorId = 1 });

            await service.GetByIdAsync(created.Id);
            var second = await service.GetByIdAsync(created.Id);

            Assert.Equal(2, second!.ViewCount);
        }

        [Fact]
        public async Task GetPagedAsync_BaslikaGoreArama_EslesenSonucDoner()
        {
            var service = CreateService(out _);
            await service.CreateAsync(new BlogCreateDto { Title = "ASP.NET Core Rehberi", Content = "İçerik", AuthorId = 1 });
            await service.CreateAsync(new BlogCreateDto { Title = "React ile Frontend", Content = "İçerik", AuthorId = 1 });

            var result = await service.GetPagedAsync(page: 1, pageSize: 10, search: "ASP.NET");

            Assert.Single(result.Items);
            Assert.Equal("ASP.NET Core Rehberi", result.Items.First().Title);
        }
    }
}

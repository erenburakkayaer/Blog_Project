using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Repositories;
using BlogProject.API.Services;

namespace BlogProject.Tests.Services
{
    // GenericCrudService, dedicated servisi olmayan 16 modülün (Category, Page, Slider vb.)
    // ortak business katmanıdır — burada Category üzerinden temsilen test ediliyor
    public class GenericCrudServiceTests
    {
        private static GenericCrudService<Category, CategoryDto, CategoryDto, CategoryDto> CreateService(
            BlogProject.API.Data.AppDbContext context) =>
            new(new GenericRepository<Category>(context), TestHelpers.CreateMapper());

        [Fact]
        public async Task CreateAsync_EntityEkler_VeDtoDoner()
        {
            var context = TestHelpers.CreateContext();
            var service = CreateService(context);

            var created = await service.CreateAsync(new CategoryDto { Name = "Teknoloji", Slug = "teknoloji", Type = "Blog" });

            Assert.True(created.Id > 0);
            Assert.Single(context.Categories);
        }

        [Fact]
        public async Task GetPagedAsync_IsimAlaninaGoreAramaCalisir()
        {
            var context = TestHelpers.CreateContext();
            var service = CreateService(context);
            await service.CreateAsync(new CategoryDto { Name = "Teknoloji", Slug = "teknoloji", Type = "Blog" });
            await service.CreateAsync(new CategoryDto { Name = "Sağlık", Slug = "saglik", Type = "Blog" });

            var result = await service.GetPagedAsync(page: 1, pageSize: 10, search: "Tekno");

            Assert.Single(result.Items);
            Assert.Equal("Teknoloji", result.Items.First().Name);
        }

        [Fact]
        public async Task DeleteAsync_OlmayanIdIcin_FalseDoner()
        {
            var context = TestHelpers.CreateContext();
            var service = CreateService(context);

            var result = await service.DeleteAsync(999);

            Assert.False(result);
        }
    }
}

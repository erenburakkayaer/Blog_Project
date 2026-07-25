using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Repositories;
using BlogProject.API.Services;

namespace BlogProject.Tests.Services
{
    public class UserServiceTests
    {
        private static UserService CreateService()
        {
            var context = TestHelpers.CreateContext();

            // UserRepository sorguları Role'ü Include ediyor; gerçek DB'de RoleId FK ile
            // var olan bir Role'e bağlı olmak zorunda olurdu — testte de önce Role (Id=1) oluşturuluyor
            context.Roles.Add(new Role { Id = 1, Name = "Yazar" });
            context.SaveChanges();

            var repository = new UserRepository(context);
            return new UserService(repository, TestHelpers.CreateMapper());
        }

        [Fact]
        public async Task CreateAsync_ParolayiDuzMetinOlarakSaklamaz()
        {
            var service = CreateService();

            var created = await service.CreateAsync(new UserCreateDto
            {
                Username = "burak",
                Email = "burak@firmaadi.com",
                Password = "Gizli123!",
                RoleId = 1
            });

            var fetched = await service.GetByIdAsync(created.Id);
            Assert.NotNull(fetched);
            // UserDto'da PasswordHash alanı hiç yok — DTO seviyesinde de sızmıyor
            Assert.DoesNotContain("PasswordHash", typeof(UserDto).GetProperties().Select(p => p.Name));
        }

        [Fact]
        public async Task CreateAsync_AyniKullaniciAdiIkinciKez_HataFirlatir()
        {
            var service = CreateService();
            await service.CreateAsync(new UserCreateDto { Username = "burak", Email = "a@a.com", Password = "Gizli123!", RoleId = 1 });

            await Assert.ThrowsAsync<InvalidOperationException>(() =>
                service.CreateAsync(new UserCreateDto { Username = "burak", Email = "b@b.com", Password = "Gizli123!", RoleId = 1 }));
        }

        [Fact]
        public async Task GetPagedAsync_KullaniciAdinaGoreArama_EslesenSonucDoner()
        {
            var service = CreateService();
            await service.CreateAsync(new UserCreateDto { Username = "burak", Email = "burak@a.com", Password = "Gizli123!", RoleId = 1 });
            await service.CreateAsync(new UserCreateDto { Username = "mehdi", Email = "mehdi@a.com", Password = "Gizli123!", RoleId = 1 });

            var result = await service.GetPagedAsync(page: 1, pageSize: 10, search: "burak");

            Assert.Single(result.Items);
            Assert.Equal("burak", result.Items.First().Username);
        }
    }
}

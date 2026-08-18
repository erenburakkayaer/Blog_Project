using BlogProject.API.DTO;
using BlogProject.API.Repositories;
using BlogProject.API.Services;

namespace BlogProject.Tests.Services
{
    public class MessageServiceTests
    {
        private static MessageService CreateService(out BlogProject.API.Data.AppDbContext context)
        {
            context = TestHelpers.CreateContext();
            var repository = new MessageRepository(context);
            return new MessageService(repository, TestHelpers.CreateMapper());
        }

        [Fact]
        public async Task GetFilteredPagedAsync_IsImportantFiltresiCalisir()
        {
            var service = CreateService(out _);
            var important = await service.CreateAsync(new MessageCreateDto { Name = "Ali", Email = "ali@a.com", Subject = "Acil", Content = "Önemli mesaj" });
            await service.CreateAsync(new MessageCreateDto { Name = "Veli", Email = "veli@a.com", Subject = "Normal", Content = "Sıradan mesaj" });

            await service.UpdateAsync(important.Id, new MessageUpdateDto { IsImportant = true });

            var result = await service.GetFilteredPagedAsync(page: 1, pageSize: 10, search: null, isRead: null, isImportant: true, isArchived: null);

            Assert.Single(result.Items);
            Assert.Equal("Acil", result.Items.First().Subject);
        }

        [Fact]
        public async Task CreateAsync_IsImportantVeIsArchivedDisaridanSetEdilemez()
        {
            var service = CreateService(out _);

            var created = await service.CreateAsync(new MessageCreateDto { Name = "Ziyaretçi", Email = "z@a.com", Subject = "Konu", Content = "İçerik" });

            Assert.False(created.IsImportant);
            Assert.False(created.IsArchived);
        }
    }
}

using BlogProject.API.Entities;
using BlogProject.API.Repositories;
using BlogProject.API.Services;

namespace BlogProject.Tests.Services
{
    public class CommentServiceTests
    {
        [Fact]
        public async Task GetApprovedByBlogIdAsync_SadeceOnayliYorumlariDoner()
        {
            var context = TestHelpers.CreateContext();
            context.Comments.AddRange(
                new Comment { Id = 1, BlogId = 1, Name = "Ali", Email = "ali@a.com", Content = "Onaylı yorum", IsApproved = true, CreatedAt = DateTime.UtcNow },
                new Comment { Id = 2, BlogId = 1, Name = "Veli", Email = "veli@a.com", Content = "Onaysız yorum", IsApproved = false, CreatedAt = DateTime.UtcNow },
                new Comment { Id = 3, BlogId = 2, Name = "Ayşe", Email = "ayse@a.com", Content = "Başka bloga ait", IsApproved = true, CreatedAt = DateTime.UtcNow }
            );
            await context.SaveChangesAsync();

            var service = new CommentService(new CommentRepository(context), TestHelpers.CreateMapper());

            var result = await service.GetApprovedByBlogIdAsync(blogId: 1);

            Assert.Single(result);
            Assert.Equal("Onaylı yorum", result.First().Content);
        }

        [Fact]
        public async Task CreateAsync_IsApprovedAlaniniDisaridanKabulEtmez()
        {
            var context = TestHelpers.CreateContext();
            var service = new CommentService(new CommentRepository(context), TestHelpers.CreateMapper());

            var created = await service.CreateAsync(new BlogProject.API.DTO.CommentCreateDto
            {
                BlogId = 1,
                Name = "Ziyaretçi",
                Email = "ziyaretci@a.com",
                Content = "Yeni yorum"
            });

            // CommentCreateDto'da IsApproved alanı hiç yok — yeni yorum her zaman onaysız başlar
            Assert.False(created.IsApproved);
        }
    }
}

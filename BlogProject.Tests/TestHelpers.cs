using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using BlogProject.API.Data;
using BlogProject.API.Helpers;

namespace BlogProject.Tests
{
    // Her testte ayrı, izole bir InMemory veritabanı — gerçek SQL Server'a hiç dokunulmaz
    public static class TestHelpers
    {
        public static AppDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        public static IMapper CreateMapper()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>(), NullLoggerFactory.Instance);
            return config.CreateMapper();
        }
    }
}

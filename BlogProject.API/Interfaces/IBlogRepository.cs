using BlogProject.API.Entities;

namespace BlogProject.API.Interfaces
{
    // Blog'a özgü sorgular Generic Repository'nin üzerine buradan eklenir
    public interface IBlogRepository : IGenericRepository<Blog>
    {
        Task<Blog?> GetBySlugAsync(string slug);
        Task<IEnumerable<Blog>> GetPublishedAsync();
    }
}

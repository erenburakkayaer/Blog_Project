using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface IBlogRepository : IGenericRepository<Blog>
    {
        // Tüm ilişkili verileriyle (Category, Author, CoverImageAsset, BlogComments) blogları getirir
        Task<List<Blog>> GetBlogsWithDetailsAsync();

        // Id'ye göre tek bir bloğu tüm detaylarıyla getirir
        Task<Blog?> GetBlogWithDetailsByIdAsync(int id);

        // Yalnızca yayınlanmış (IsPublished = true) ve silinmemiş (IsDeleted = false) blogları getirir
        Task<List<Blog>> GetPublishedBlogsAsync();

        // Belirli bir kategoriye ait blogları getirir
        Task<List<Blog>> GetBlogsByCategoryIdAsync(int categoryId);
    }
}
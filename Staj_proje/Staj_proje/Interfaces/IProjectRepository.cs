using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface IProjectRepository : IGenericRepository<Project>
    {
        // Projeyi slug bilgisine göre kategorisi, kapak görseli ve galeri fotoğraflarıyla getirir
        Task<Project?> GetBySlugWithDetailsAsync(string slug);

        // Id'ye göre projeyi tüm detaylarıyla getirir
        Task<Project?> GetProjectWithDetailsByIdAsync(int id);

        // Ana sayfada gösterilmek üzere öne çıkan projeleri sıralı getirir
        Task<List<Project>> GetFeaturedProjectsWithDetailsAsync();

        // Kategoriye göre filtrelenmiş aktif projeleri getirir
        Task<List<Project>> GetProjectsByCategoryIdAsync(int categoryId);
    }
}
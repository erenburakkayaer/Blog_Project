using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface IPageRepository : IGenericRepository<Page>
    {
        // URL üzerindeki slug değerine göre sayfayı SEO ve Banner detaylarıyla getirir
        Task<Page?> GetBySlugAsync(string slug);

        // Header menüsünde gösterilecek aktif sayfaları sıralı getirir
        Task<List<Page>> GetHeaderPagesAsync();

        // Footer menüsünde gösterilecek aktif sayfaları sıralı getirir
        Task<List<Page>> GetFooterPagesAsync();
    }
}
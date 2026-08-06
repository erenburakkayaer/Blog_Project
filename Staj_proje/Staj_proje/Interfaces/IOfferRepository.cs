using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface IOfferRepository : IGenericRepository<Offer>
    {
        // Teklifi tüm ilişkili verileriyle (Şirket, Hizmet, Aday Kullanıcı ve Dosyalar) getirir
        Task<Offer?> GetOfferWithDetailsByIdAsync(int id);

        // Belirli bir şirkete gelen tüm teklifleri detaylarıyla getirir
        Task<List<Offer>> GetOffersByCompanyIdAsync(int companyId);

        // Belirli bir kullanıcının geçmiş teklif taleplerini getirir
        Task<List<Offer>> GetOffersByUserIdAsync(int userId);

        // Teklif durumuna göre filtreleme (Örn: Pending, Sent, Accepted)
        Task<List<Offer>> GetOffersByStatusAsync(OfferStatus status);
    }
}
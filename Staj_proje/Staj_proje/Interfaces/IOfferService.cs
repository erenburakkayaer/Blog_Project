using Staj_proje.DTO.Offer;
using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface IOfferService
    {
        // Create
        Task<int> CreateOfferAsync(OfferCreateDto createOfferDto, int requesterUserId);
        
        // Read
        Task<OfferDetailDto> GetOfferByIdAsync(int id);
        Task<List<OfferListDto>> GetAllOffersAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> GetOffersByCompanyAsync(int companyId, int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> GetOffersByUserAsync(int userId, int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> GetOffersByStatusAsync(OfferStatus status, int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> GetPendingOffersAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> GetSentOffersAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> GetAcceptedOffersAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> GetRejectedOffersAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> GetExpiredOffersAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> GetOffersByCompanyServiceAsync(int companyServiceId, int pageNumber = 1, int pageSize = 20);
        
        // Update - Şirket Yanıtı
        Task<bool> RespondToOfferAsync(int id, OfferCompanyDto companyResponseDto);
        Task<bool> UpdateOfferStatusAsync(int id, OfferStatusUpdateDto statusUpdateDto);
        
        // Status Updates
        Task<bool> MarkAsInReviewAsync(int id);
        Task<bool> MarkAsSentAsync(int id);
        Task<bool> MarkAsAcceptedAsync(int id);
        Task<bool> MarkAsRejectedAsync(int id);
        Task<bool> MarkAsExpiredAsync(int id);
        Task<bool> MarkAsCanceledAsync(int id);
        
        // Delete
        Task<bool> DeleteOfferAsync(int id);
        Task<bool> RestoreOfferAsync(int id);
        Task<bool> PermanentlyDeleteOfferAsync(int id);
        Task<bool> DeleteOffersByCompanyAsync(int companyId);
        
        // Search & Filter
        Task<List<OfferListDto>> SearchOffersByTitleAsync(string title, int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> SearchOffersByContactNameAsync(string contactName, int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> GetOffersByDateRangeAsync(DateTime startDate, DateTime endDate, 
            int pageNumber = 1, int pageSize = 20);
        Task<List<OfferListDto>> GetOffersByValidUntilDateAsync(DateTime beforeDate, int pageNumber = 1, int pageSize = 20);
        
        // Statistics
        Task<int> GetTotalOfferCountAsync();
        Task<int> GetPendingOfferCountAsync();
        Task<int> GetPendingOfferCountByCompanyAsync(int companyId);
        Task<int> GetOfferCountByCompanyAsync(int companyId);
        Task<int> GetOfferCountByStatusAsync(OfferStatus status);
        Task<int> GetExpiredOfferCountAsync();
        
        // Validation & Check
        Task<bool> IsOfferExistsAsync(int id);
        Task<bool> IsCompanyExistsAsync(int companyId);
        Task<bool> IsCompanyServiceExistsAsync(int companyServiceId);
        Task<bool> IsUserExistsAsync(int userId);
        Task<bool> IsOfferExpiredAsync(int id);
        
        // Email Notifications
        Task<bool> SendOfferRequestEmailToCompanyAsync(int offerId);
        Task<bool> SendOfferResponseEmailToRequesterAsync(int offerId);
    }
}
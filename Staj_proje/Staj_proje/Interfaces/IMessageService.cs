using Staj_proje.DTO.Message;
using Staj_proje.Entities;

namespace Staj_proje.Services.Interfaces
{
    public interface IMessageService
    {
        // Create
        Task<int> CreateMessageAsync(MessageCreateDto createMessageDto, string ipAddress, int? userId = null);
        
        // Read
        Task<MessageDetailDto> GetMessageByIdAsync(int id);
        Task<List<MessageListDto>> GetAllMessagesAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<MessageListDto>> GetMessagesByCompanyAsync(int companyId, int pageNumber = 1, int pageSize = 20);
        Task<List<MessageListDto>> GetMessagesByStatusAsync(MessageStatus status, int pageNumber = 1, int pageSize = 20);
        Task<List<MessageListDto>> GetNewMessagesAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<MessageListDto>> GetRepliedMessagesAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<MessageListDto>> GetSpamMessagesAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<MessageListDto>> GetArchivedMessagesAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<MessageListDto>> GetMessagesByUserAsync(int userId, int pageNumber = 1, int pageSize = 20);
        
        // Update
        Task<bool> UpdateMessageStatusAsync(int id, MessageAdminUpdateDto updateAdminDto);
        Task<bool> MarkAsReadAsync(int id);
        Task<bool> MarkAsSpamAsync(int id);
        Task<bool> MarkAsArchivedAsync(int id);
        Task<bool> RestoreFromArchiveAsync(int id);
        
        // Reply
        Task<bool> ReplyToMessageAsync(int id, MessageReplyDto replyDto);
        Task<bool> SendReplyEmailAsync(int id);
        
        // Delete
        Task<bool> DeleteMessageAsync(int id);
        Task<bool> RestoreMessageAsync(int id);
        Task<bool> PermanentlyDeleteMessageAsync(int id);
        Task<bool> DeleteMessagesByCompanyAsync(int companyId);
        
        // Search & Filter
        Task<List<MessageListDto>> SearchMessagesBySubjectAsync(string subject, int pageNumber = 1, int pageSize = 20);
        Task<List<MessageListDto>> SearchMessagesByEmailAsync(string email, int pageNumber = 1, int pageSize = 20);
        Task<List<MessageListDto>> GetMessagesByDateRangeAsync(DateTime startDate, DateTime endDate, 
            int pageNumber = 1, int pageSize = 20);
        
        // Statistics
        Task<int> GetTotalMessageCountAsync();
        Task<int> GetUnreadMessageCountAsync();
        Task<int> GetNewMessageCountByCompanyAsync(int companyId);
        Task<int> GetMessageCountByStatusAsync(MessageStatus status);
        Task<int> GetSpamMessageCountAsync();
        
        // Validation & Check
        Task<bool> IsMessageExistsAsync(int id);
        Task<bool> IsCompanyExistsAsync(int companyId);
    }
}
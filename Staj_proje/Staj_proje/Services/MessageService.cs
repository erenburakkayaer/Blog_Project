using Mapster;
using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.DTO.Message;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    public class MessageService : IMessageService
    {
        private readonly AppDbContext _context;

        public MessageService(AppDbContext context)
        {
            _context = context;
        }

        #region Create

        public async Task<int> CreateMessageAsync(MessageCreateDto createMessageDto, string ipAddress, int? userId = null)
        {
            var isCompanyExist = await IsCompanyExistsAsync(createMessageDto.CompanyId);
            if (!isCompanyExist)
            {
                throw new KeyNotFoundException($"ID değeri {createMessageDto.CompanyId} olan şirket bulunamadı.");
            }

            var message = createMessageDto.Adapt<Message>();
            message.IpAddress = ipAddress;
            message.UserId = userId;
            message.CreatedAt = DateTime.UtcNow;
            message.Status = MessageStatus.New;
            message.IsDeleted = false;

            await _context.Set<Message>().AddAsync(message);
            await _context.SaveChangesAsync();

            return message.Id;
        }

        #endregion

        #region Read

        public async Task<MessageDetailDto> GetMessageByIdAsync(int id)
        {
            var message = await _context.Set<Message>()
                .Include(m => m.Company)
                .Include(m => m.User)
                .Include(m => m.AttachmentFile)
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

            if (message == null)
            {
                throw new KeyNotFoundException($"ID değeri {id} olan mesaj bulunamadı.");
            }

            return message.Adapt<MessageDetailDto>();
        }

        public async Task<List<MessageListDto>> GetAllMessagesAsync(int pageNumber = 1, int pageSize = 20)
        {
            return await _context.Set<Message>()
                .AsNoTracking()
                .Include(m => m.Company)
                .Where(m => !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ProjectToType<MessageListDto>()
                .ToListAsync();
        }

        public async Task<List<MessageListDto>> GetMessagesByCompanyAsync(int companyId, int pageNumber = 1, int pageSize = 20)
        {
            return await _context.Set<Message>()
                .AsNoTracking()
                .Include(m => m.Company)
                .Where(m => m.CompanyId == companyId && !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ProjectToType<MessageListDto>()
                .ToListAsync();
        }

        public async Task<List<MessageListDto>> GetMessagesByStatusAsync(MessageStatus status, int pageNumber = 1, int pageSize = 20)
        {
            return await _context.Set<Message>()
                .AsNoTracking()
                .Include(m => m.Company)
                .Where(m => m.Status == status && !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ProjectToType<MessageListDto>()
                .ToListAsync();
        }

        public async Task<List<MessageListDto>> GetNewMessagesAsync(int pageNumber = 1, int pageSize = 20)
        {
            return await GetMessagesByStatusAsync(MessageStatus.New, pageNumber, pageSize);
        }

        public async Task<List<MessageListDto>> GetRepliedMessagesAsync(int pageNumber = 1, int pageSize = 20)
        {
            return await GetMessagesByStatusAsync(MessageStatus.Replied, pageNumber, pageSize);
        }

        public async Task<List<MessageListDto>> GetSpamMessagesAsync(int pageNumber = 1, int pageSize = 20)
        {
            return await GetMessagesByStatusAsync(MessageStatus.Spam, pageNumber, pageSize);
        }

        public async Task<List<MessageListDto>> GetArchivedMessagesAsync(int pageNumber = 1, int pageSize = 20)
        {
            return await GetMessagesByStatusAsync(MessageStatus.Archived, pageNumber, pageSize);
        }

        public async Task<List<MessageListDto>> GetMessagesByUserAsync(int userId, int pageNumber = 1, int pageSize = 20)
        {
            return await _context.Set<Message>()
                .AsNoTracking()
                .Include(m => m.Company)
                .Where(m => m.UserId == userId && !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ProjectToType<MessageListDto>()
                .ToListAsync();
        }

        #endregion

        #region Update

        public async Task<bool> UpdateMessageStatusAsync(int id, MessageAdminUpdateDto updateAdminDto)
        {
            var message = await _context.Set<Message>()
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

            if (message == null) return false;

            updateAdminDto.Adapt(message);

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            var message = await _context.Set<Message>()
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

            if (message == null) return false;

            if (message.Status == MessageStatus.New)
            {
                message.Status = MessageStatus.Read;
                return await _context.SaveChangesAsync() > 0;
            }

            return true;
        }

        public async Task<bool> MarkAsSpamAsync(int id)
        {
            var message = await _context.Set<Message>()
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

            if (message == null) return false;

            message.Status = MessageStatus.Spam;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> MarkAsArchivedAsync(int id)
        {
            var message = await _context.Set<Message>()
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

            if (message == null) return false;

            message.Status = MessageStatus.Archived;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RestoreFromArchiveAsync(int id)
        {
            var message = await _context.Set<Message>()
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

            if (message == null) return false;

            if (message.Status == MessageStatus.Archived)
            {
                message.Status = MessageStatus.Read;
                return await _context.SaveChangesAsync() > 0;
            }

            return true;
        }

        #endregion

        #region Reply

        public async Task<bool> ReplyToMessageAsync(int id, MessageReplyDto replyDto)
        {
            var message = await _context.Set<Message>()
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

            if (message == null) return false;

            replyDto.Adapt(message);
            message.RepliedAt = DateTime.UtcNow;
            message.Status = MessageStatus.Replied;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> SendReplyEmailAsync(int id)
        {
            var message = await _context.Set<Message>()
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

            if (message == null || string.IsNullOrWhiteSpace(message.ReplyMessage))
            {
                return false;
            }

            // Burada e-posta gönderim servisi (IEmailSender / IEmailService) tetiklenebilir.
            return await Task.FromResult(true);
        }

        #endregion

        #region Delete

        public async Task<bool> DeleteMessageAsync(int id)
        {
            var message = await _context.Set<Message>()
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);

            if (message == null) return false;

            message.IsDeleted = true;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RestoreMessageAsync(int id)
        {
            var message = await _context.Set<Message>()
                .FirstOrDefaultAsync(m => m.Id == id && m.IsDeleted);

            if (message == null) return false;

            message.IsDeleted = false;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> PermanentlyDeleteMessageAsync(int id)
        {
            var message = await _context.Set<Message>()
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(m => m.Id == id);

            if (message == null) return false;

            _context.Set<Message>().Remove(message);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteMessagesByCompanyAsync(int companyId)
        {
            var messages = await _context.Set<Message>()
                .Where(m => m.CompanyId == companyId && !m.IsDeleted)
                .ToListAsync();

            if (!messages.Any()) return true;

            foreach (var message in messages)
            {
                message.IsDeleted = true;
            }

            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region Search & Filter

        public async Task<List<MessageListDto>> SearchMessagesBySubjectAsync(string subject, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(subject))
                return await GetAllMessagesAsync(pageNumber, pageSize);

            return await _context.Set<Message>()
                .AsNoTracking()
                .Include(m => m.Company)
                .Where(m => m.Subject.Contains(subject) && !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ProjectToType<MessageListDto>()
                .ToListAsync();
        }

        public async Task<List<MessageListDto>> SearchMessagesByEmailAsync(string email, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(email))
                return await GetAllMessagesAsync(pageNumber, pageSize);

            return await _context.Set<Message>()
                .AsNoTracking()
                .Include(m => m.Company)
                .Where(m => m.Email.Contains(email) && !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ProjectToType<MessageListDto>()
                .ToListAsync();
        }

        public async Task<List<MessageListDto>> GetMessagesByDateRangeAsync(DateTime startDate, DateTime endDate, int pageNumber = 1, int pageSize = 20)
        {
            return await _context.Set<Message>()
                .AsNoTracking()
                .Include(m => m.Company)
                .Where(m => m.CreatedAt >= startDate && m.CreatedAt <= endDate && !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ProjectToType<MessageListDto>()
                .ToListAsync();
        }

        #endregion

        #region Statistics

        public async Task<int> GetTotalMessageCountAsync()
        {
            return await _context.Set<Message>()
                .CountAsync(m => !m.IsDeleted);
        }

        public async Task<int> GetUnreadMessageCountAsync()
        {
            return await _context.Set<Message>()
                .CountAsync(m => m.Status == MessageStatus.New && !m.IsDeleted);
        }

        public async Task<int> GetNewMessageCountByCompanyAsync(int companyId)
        {
            return await _context.Set<Message>()
                .CountAsync(m => m.CompanyId == companyId && m.Status == MessageStatus.New && !m.IsDeleted);
        }

        public async Task<int> GetMessageCountByStatusAsync(MessageStatus status)
        {
            return await _context.Set<Message>()
                .CountAsync(m => m.Status == status && !m.IsDeleted);
        }

        public async Task<int> GetSpamMessageCountAsync()
        {
            return await GetMessageCountByStatusAsync(MessageStatus.Spam);
        }

        #endregion

        #region Validation & Check

        public async Task<bool> IsMessageExistsAsync(int id)
        {
            return await _context.Set<Message>()
                .AnyAsync(m => m.Id == id && !m.IsDeleted);
        }

        public async Task<bool> IsCompanyExistsAsync(int companyId)
        {
            return await _context.Set<Company>()
                .AnyAsync(c => c.Id == companyId);
        }

        #endregion
    }
}
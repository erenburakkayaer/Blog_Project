using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Staj_proje.Repositories
{
    public class MessageRepository : GenericRepository<Message>, IMessageRepository
    {
        public MessageRepository(AppDbContext context) : base(context)
        {
        }


        public async Task<Message?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Set<Message>()
                .Include(m => m.Company)
                .Include(m => m.User)
                .Include(m => m.AttachmentFile)
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);
        }

        public async Task<IEnumerable<Message>> GetByCompanyIdAsync(int companyId)
        {
            return await _context.Set<Message>()
                .Where(m => m.CompanyId == companyId && !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Message>> GetByStatusAsync(MessageStatus status)
        {
            return await _context.Set<Message>()
                .Where(m => m.Status == status && !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }
    }
}
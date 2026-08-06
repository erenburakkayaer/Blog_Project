using Staj_proje.Entities;
using Staj_proje.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Staj_proje.Repositories
{
    public interface IMessageRepository : IGenericRepository<Message>
    {
        Task<Message?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<Message>> GetByCompanyIdAsync(int companyId);
        Task<IEnumerable<Message>> GetByStatusAsync(MessageStatus status);
    }
}
using BlogProject.API.Entities;

namespace BlogProject.API.Interfaces
{
    public interface IMessageRepository : IGenericRepository<Message>
    {
        Task<(IEnumerable<Message> Items, int TotalCount)> GetFilteredPagedAsync(
            int page, int pageSize, string? search, bool? isRead, bool? isImportant, bool? isArchived);
    }
}

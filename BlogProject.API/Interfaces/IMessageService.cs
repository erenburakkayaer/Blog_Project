using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    public interface IMessageService
    {
        Task<PagedResultDto<MessageDto>> GetFilteredPagedAsync(
            int page, int pageSize, string? search, bool? isRead, bool? isImportant, bool? isArchived);
        Task<MessageDto?> GetByIdAsync(int id);
        Task<MessageDto> CreateAsync(MessageCreateDto dto);
        Task<bool> UpdateAsync(int id, MessageUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

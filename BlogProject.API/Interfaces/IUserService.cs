using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<PagedResultDto<UserDto>> GetPagedAsync(int page, int pageSize);
        Task<UserDto?> GetByIdAsync(int id);
        Task<UserDto> CreateAsync(UserCreateDto dto);
        Task<bool> UpdateAsync(int id, UserUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    public interface IRoleService
    {
        Task<IEnumerable<RoleDto>> GetAllAsync();
        Task<RoleDto?> GetByIdAsync(int id);
        Task<RoleDto> CreateAsync(RoleCreateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

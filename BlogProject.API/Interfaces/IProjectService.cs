using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    public interface IProjectService
    {
        Task<PagedResultDto<ProjectDto>> GetPagedAsync(int page, int pageSize, string? search = null);
        Task<ProjectDto?> GetByIdAsync(int id);
        Task<ProjectDto> CreateAsync(ProjectCreateDto dto);
        Task<bool> UpdateAsync(int id, ProjectUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

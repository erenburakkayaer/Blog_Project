using Staj_proje.DTO.Project;

namespace Staj_proje.Services.Interfaces
{
    public interface IProjectService
    {
        // Create
        Task<int> CreateProjectAsync(ProjectCreateDto createProjectDto);
        
        // Read
        Task<ProjectDetailDto> GetProjectByIdAsync(int id);
        Task<ProjectDetailDto> GetProjectBySlugAsync(string slug);
        Task<List<ProjectListDto>> GetAllProjectsAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<ProjectListDto>> GetActiveProjectsAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<ProjectListDto>> GetFeaturedProjectsAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<ProjectListDto>> GetProjectsByCategoryAsync(int categoryId, int pageNumber = 1, int pageSize = 20);
        Task<List<ProjectListDto>> GetProjectsByTechnologyAsync(string technology, int pageNumber = 1, int pageSize = 20);
        Task<List<ProjectListDto>> GetProjectsByClientNameAsync(string clientName, int pageNumber = 1, int pageSize = 20);
        Task<List<ProjectListDto>> GetProjectsByCompletionDateRangeAsync(DateTime startDate, DateTime endDate, 
            int pageNumber = 1, int pageSize = 20);
        
        // Update
        Task<bool> UpdateProjectAsync(int id, ProjectUpdateDto updateProjectDto);
        Task<bool> ActivateProjectAsync(int id);
        Task<bool> DeactivateProjectAsync(int id);
        Task<bool> FeatureProjectAsync(int id);
        Task<bool> UnfeatureProjectAsync(int id);
        Task<bool> UpdateDisplayOrderAsync(int id, int displayOrder);
        Task<bool> UpdateCoverImageAsync(int id, int fileAssetId);
        
        // Delete
        Task<bool> DeleteProjectAsync(int id);
        Task<bool> RestoreProjectAsync(int id);
        Task<bool> PermanentlyDeleteProjectAsync(int id);
        
        // Search & Filter
        Task<List<ProjectListDto>> SearchProjectsByTitleAsync(string title, int pageNumber = 1, int pageSize = 20);
        Task<List<ProjectListDto>> SearchProjectsByDescriptionAsync(string keyword, int pageNumber = 1, int pageSize = 20);
        
        // Statistics
        Task<int> GetTotalProjectCountAsync();
        Task<int> GetActiveProjectCountAsync();
        Task<int> GetFeaturedProjectCountAsync();
        Task<int> GetProjectCountByCategoryAsync(int categoryId);
        
        // Validation & Check
        Task<bool> IsProjectExistsAsync(int id);
        Task<bool> IsProjectExistsBySlugAsync(string slug);
        Task<bool> IsSlugUniqueAsync(string slug, int? excludeProjectId = null);
        Task<bool> IsCategoryExistsAsync(int categoryId);
        Task<bool> IsFileAssetExistsAsync(int fileAssetId);
    }
}
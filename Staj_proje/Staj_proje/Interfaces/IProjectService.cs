using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface IProjectService
    {
        // Create
        Task<int> CreateProjectAsync(Project project);
        
        // Read
        Task<Project> GetProjectByIdAsync(int id);
        Task<Project> GetProjectBySlugAsync(string slug);
        Task<List<Project>> GetAllProjectsAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<Project>> GetActiveProjectsAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<Project>> GetFeaturedProjectsAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<Project>> GetProjectsByCategoryAsync(int categoryId, int pageNumber = 1, int pageSize = 20);
        Task<List<Project>> GetActiveProjectsByCategoryAsync(int categoryId, int pageNumber = 1, int pageSize = 20);
        Task<List<Project>> GetProjectsByTechnologyAsync(string technology, int pageNumber = 1, int pageSize = 20);
        Task<List<Project>> GetProjectsByClientNameAsync(string clientName, int pageNumber = 1, int pageSize = 20);
        Task<List<Project>> GetProjectsByCompletionDateRangeAsync(DateTime startDate, DateTime endDate, 
            int pageNumber = 1, int pageSize = 20);
        
        // Update
        Task<bool> UpdateProjectAsync(int id, Project project);
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
        Task<List<Project>> SearchProjectsByTitleAsync(string title, int pageNumber = 1, int pageSize = 20);
        Task<List<Project>> SearchProjectsByDescriptionAsync(string keyword, int pageNumber = 1, int pageSize = 20);
        
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
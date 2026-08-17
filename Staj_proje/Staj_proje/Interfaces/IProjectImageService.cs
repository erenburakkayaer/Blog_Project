using Staj_proje.DTO.ProjectImage;

namespace Staj_proje.Services.Interfaces
{
    public interface IProjectImageService
    {
        // Create
        Task<int> CreateProjectImageAsync(ProjectImageCreateDto createProjectImageDto);
        Task<List<int>> CreateMultipleProjectImagesAsync(List<ProjectImageCreateDto> createProjectImageDtos);
        
        // Read
        Task<ProjectImageResponseDto> GetProjectImageByIdAsync(int id);
        Task<List<ProjectImageResponseDto>> GetAllProjectImagesAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<ProjectImageResponseDto>> GetProjectImagesByProjectAsync(int projectId);
        Task<List<ProjectImageResponseDto>> GetProjectImagesByProjectOrderedAsync(int projectId);
        Task<ProjectImageResponseDto> GetCoverImageByProjectAsync(int projectId);
        
        // Update
        Task<bool> UpdateProjectImageAsync(int id, ProjectImageUpdateDto updateProjectImageDto);
        Task<bool> SetAsCoverImageAsync(int id);
        Task<bool> RemoveCoverImageAsync(int projectId);
        Task<bool> UpdateDisplayOrderAsync(int id, int displayOrder);
        Task<bool> UpdateAltTextAsync(int id, string altText);
        Task<bool> UpdateTitleAsync(int id, string title);
        
        // Delete
        Task<bool> DeleteProjectImageAsync(int id);
        Task<bool> RestoreProjectImageAsync(int id);
        Task<bool> PermanentlyDeleteProjectImageAsync(int id);
        Task<bool> DeleteProjectImagesByProjectAsync(int projectId);
        
        // Reordering
        Task<bool> ReorderProjectImagesAsync(int projectId, List<int> imageIds);
        
        // Search & Filter
        Task<List<ProjectImageResponseDto>> SearchProjectImagesByAltTextAsync(string altText);
        Task<List<ProjectImageResponseDto>> SearchProjectImagesByTitleAsync(string title);
        
        // Statistics
        Task<int> GetTotalProjectImageCountAsync();
        Task<int> GetProjectImageCountByProjectAsync(int projectId);
        
        // Validation & Check
        Task<bool> IsProjectImageExistsAsync(int id);
        Task<bool> IsProjectExistsAsync(int projectId);
        Task<bool> IsFileAssetExistsAsync(int fileAssetId);
        Task<bool> HasCoverImageAsync(int projectId);
        Task<bool> IsImageBelongsToProjectAsync(int imageId, int projectId);
    }
}
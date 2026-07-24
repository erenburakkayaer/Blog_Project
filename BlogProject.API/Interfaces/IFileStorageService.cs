using Microsoft.AspNetCore.Http;
using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    public interface IFileStorageService
    {
        Task<FileAssetDto> SaveAsync(IFormFile file);
        Task<IEnumerable<FileAssetDto>> GetAllAsync();
        Task<bool> DeleteAsync(int id);
    }
}

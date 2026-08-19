using Staj_proje.DTO.FileAsset;

namespace Staj_proje.Interfaces
{
    public interface IFileAssetService
    {
        // Upload
        Task<int> UploadFileAsync(FileAssetUploadDto uploadDto, int userId);
        Task<List<int>> UploadMultipleFilesAsync(List<FileAssetUploadDto> uploadDtos, int userId);
        
        // Read
        Task<FileAssetResponseDto> GetFileAssetByIdAsync(int id);
        Task<List<FileAssetResponseDto>> GetAllFileAssetsAsync();
        Task<List<FileAssetResponseDto>> GetFileAssetsByUserAsync(int userId);
        Task<List<FileAssetResponseDto>> GetFileAssetsByCategoryAsync(string fileCategory);
        Task<List<FileAssetResponseDto>> GetFileAssetsByUserAndCategoryAsync(int userId, string fileCategory);
        
        // Update
        Task<bool> UpdateFileAssetAsync(int id, FileAssetUpdateDto updateDto);
        
        // Delete
        Task<bool> DeleteFileAssetAsync(int id);
        Task<bool> RestoreFileAssetAsync(int id);
        Task<bool> PermanentlyDeleteFileAssetAsync(int id);
        
        // Search & Filter
        Task<List<FileAssetResponseDto>> SearchFileAssetsByNameAsync(string fileName);
        Task<List<FileAssetResponseDto>> GetFileAssetsByDateRangeAsync(DateTime startDate, DateTime endDate);
        
        // Validation & Check
        Task<bool> IsFileAssetExistsAsync(int id);
        Task<bool> IsUserFileOwnerAsync(int fileAssetId, int userId);
        
        // File Operations
        Task<string> GetFileUrlAsync(int id);
        Task<byte[]> DownloadFileAsync(int id);
    }
}
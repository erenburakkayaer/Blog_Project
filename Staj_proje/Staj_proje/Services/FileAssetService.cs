using Staj_proje.DTO.FileAsset;
using Staj_proje.Interfaces;
namespace Staj_proje.Services
{
    public class FileAssetService : IFileAssetService
    {
        public Task<bool> DeleteFileAssetAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<byte[]> DownloadFileAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<FileAssetResponseDto>> GetAllFileAssetsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<FileAssetResponseDto> GetFileAssetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<FileAssetResponseDto>> GetFileAssetsByCategoryAsync(string fileCategory)
        {
            throw new NotImplementedException();
        }

        public Task<List<FileAssetResponseDto>> GetFileAssetsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            throw new NotImplementedException();
        }

        public Task<List<FileAssetResponseDto>> GetFileAssetsByUserAndCategoryAsync(int userId, string fileCategory)
        {
            throw new NotImplementedException();
        }

        public Task<List<FileAssetResponseDto>> GetFileAssetsByUserAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetFileUrlAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> IsFileAssetExistsAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> IsUserFileOwnerAsync(int fileAssetId, int userId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> PermanentlyDeleteFileAssetAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> RestoreFileAssetAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<FileAssetResponseDto>> SearchFileAssetsByNameAsync(string fileName)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateFileAssetAsync(int id, FileAssetUpdateDto updateDto)
        {
            throw new NotImplementedException();
        }

        public Task<int> UploadFileAsync(FileAssetUploadDto uploadDto, int userId)
        {
            throw new NotImplementedException();
        }

        public Task<List<int>> UploadMultipleFilesAsync(List<FileAssetUploadDto> uploadDtos, int userId)
        {
            throw new NotImplementedException();
        }
    }
}

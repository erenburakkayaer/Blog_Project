using AutoMapper;
using Microsoft.AspNetCore.Http;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    // CV, görsel, kapak resmi vb. dosya yükleme iş kuralı burada:
    // izin verilen uzantı/boyut kontrolü + diske yazma + kayıt oluşturma
    public class FileStorageService : IFileStorageService
    {
        private static readonly string[] AllowedExtensions =
            { ".jpg", ".jpeg", ".png", ".webp", ".pdf", ".doc", ".docx" };

        private const long MaxSizeBytes = 10 * 1024 * 1024; // 10 MB

        private readonly IGenericRepository<FileAsset> _fileRepository;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _environment;

        public FileStorageService(
            IGenericRepository<FileAsset> fileRepository,
            IMapper mapper,
            IWebHostEnvironment environment)
        {
            _fileRepository = fileRepository;
            _mapper = mapper;
            _environment = environment;
        }

        public async Task<FileAssetDto> SaveAsync(IFormFile file)
        {
            if (file.Length == 0)
                throw new InvalidOperationException("Dosya boş olamaz.");

            if (file.Length > MaxSizeBytes)
                throw new InvalidOperationException("Dosya boyutu 10 MB'ı aşamaz.");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
                throw new InvalidOperationException($"'{extension}' uzantısına izin verilmiyor.");

            var uploadsRoot = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads");
            Directory.CreateDirectory(uploadsRoot);

            var storedFileName = $"{Guid.NewGuid()}{extension}";
            var fullPath = Path.Combine(uploadsRoot, storedFileName);

            await using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileAsset = new FileAsset
            {
                FileName = file.FileName,
                FilePath = $"/uploads/{storedFileName}",
                ContentType = file.ContentType,
                SizeBytes = file.Length,
                UploadedAt = DateTime.UtcNow
            };

            await _fileRepository.AddAsync(fileAsset);
            await _fileRepository.SaveChangesAsync();

            return ToDto(fileAsset);
        }

        public async Task<IEnumerable<FileAssetDto>> GetAllAsync()
        {
            var files = await _fileRepository.GetAllAsync();
            return files.Select(ToDto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var fileAsset = await _fileRepository.GetByIdAsync(id);
            if (fileAsset is null) return false;

            var fullPath = Path.Combine(_environment.ContentRootPath, "wwwroot", fileAsset.FilePath.TrimStart('/'));
            if (File.Exists(fullPath))
                File.Delete(fullPath);

            _fileRepository.Remove(fileAsset);
            return await _fileRepository.SaveChangesAsync();
        }

        private static FileAssetDto ToDto(FileAsset entity) => new()
        {
            Id = entity.Id,
            FileName = entity.FileName,
            Url = entity.FilePath,
            ContentType = entity.ContentType,
            SizeBytes = entity.SizeBytes,
            UploadedAt = entity.UploadedAt
        };
    }
}

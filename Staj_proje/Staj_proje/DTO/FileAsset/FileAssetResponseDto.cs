namespace Staj_proje.DTO.FileAsset
{
    public class FileAssetResponseDto
    {
        public int Id { get; set; }
        public string OriginalFileName { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty; // Sunucudaki erişilebilir tam/göreli URL
        public string ContentType { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public string FileCategory { get; set; } = string.Empty;

        public int UploadedByUserId { get; set; }
        public string UploadedByUserName { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; }
    }
}

namespace BlogProject.API.Entities
{
    // Doküman "Files" tablosuna karşılık gelir; System.IO.File ile karışmaması için FileAsset adı seçildi
    public class FileAsset
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long SizeBytes { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}

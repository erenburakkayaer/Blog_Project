namespace Staj_proje.DTO.ProjectImage
{
    public class ProjectImageResponseDto
    {
        public int Id { get; set; }

        public int ProjectId { get; set; }
        public string ProjectTitle { get; set; } = string.Empty;

        public int FileAssetId { get; set; }
        public string ImageUrl { get; set; } = string.Empty; // FileAsset'ten türetilen görsel URL'i

        public string? AltText { get; set; }
        public string? Title { get; set; }

        public int DisplayOrder { get; set; }
        public bool IsCover { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}

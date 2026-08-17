namespace Staj_proje.DTO.GalleyItem
{
    public class GalleryItemResponseDto
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;

        public int FileAssetId { get; set; }
        public string ImageUrl { get; set; } = string.Empty; // FileAsset üzerinden türetilen görsel URL'i

        public string? Title { get; set; }
        public string? Description { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

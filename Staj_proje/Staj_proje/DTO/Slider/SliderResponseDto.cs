namespace Staj_proje.DTO.Slider
{
    public class SliderResponseDto
    {
        public int Id { get; set; }

        public string? Title { get; set; }
        public string? Subtitle { get; set; }

        public int ImageFileAssetId { get; set; }
        public string ImageUrl { get; set; } = string.Empty; // FileAsset üzerinden türetilen görsel URL'i

        public string? ButtonText { get; set; }
        public string? ButtonUrl { get; set; }
        public bool OpenInNewTab { get; set; }

        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}

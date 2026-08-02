using Staj_proje.Entities;

namespace Staj_proje.DTO.Page
{
    public class PageDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public string? Content { get; set; }

        public PageType Type { get; set; }
        public bool IsActive { get; set; }
        public bool ShowInHeader { get; set; }
        public bool ShowInFooter { get; set; }
        public int DisplayOrder { get; set; }

        public int? SeoSettingId { get; set; }

        public int? BannerImageAssetId { get; set; }
        public string? BannerImageUrl { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}

using Staj_proje.Entities;

namespace Staj_proje.DTO.Page
{
    public class PageListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public PageType Type { get; set; }

        public bool IsActive { get; set; }
        public bool ShowInHeader { get; set; }
        public bool ShowInFooter { get; set; }
        public int DisplayOrder { get; set; }

        public string? BannerImageUrl { get; set; } // BannerImageAsset üzerinden türetilen URL
        public DateTime CreatedAt { get; set; }
    }
}
}

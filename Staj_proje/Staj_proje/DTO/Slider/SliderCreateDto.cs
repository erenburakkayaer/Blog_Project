using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Slider
{
    public class SliderCreateDto
    {
        [StringLength(150, ErrorMessage = "Slider başlığı en fazla 150 karakter olabilir.")]
        public string? Title { get; set; }

        [StringLength(300, ErrorMessage = "Alt başlık en fazla 300 karakter olabilir.")]
        public string? Subtitle { get; set; }

        [Required(ErrorMessage = "Slider masaüstü görseli (FileAsset) zorunludur.")]
        public int ImageFileAssetId { get; set; }

        [StringLength(50, ErrorMessage = "Buton metni en fazla 50 karakter olabilir.")]
        public string? ButtonText { get; set; }

        [StringLength(250, ErrorMessage = "Buton yönlendirme adresi en fazla 250 karakter olabilir.")]
        public string? ButtonUrl { get; set; }

        public bool OpenInNewTab { get; set; } = true;

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }
}

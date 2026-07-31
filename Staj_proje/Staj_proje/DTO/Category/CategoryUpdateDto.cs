using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Category
{
    public class CategoryUpdateDto
    {
        [Required(ErrorMessage = "Kategori adı zorunludur.")]
        [StringLength(100, ErrorMessage = "Kategori adı en fazla 100 karakter olabilir.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir.")]
        public string? Description { get; set; }

        public bool IsActive { get; set; }
    }
}

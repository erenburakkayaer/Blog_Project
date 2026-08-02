using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Role
{
    public class RoleCreateDto
    {
        [Required(ErrorMessage = "Rol adı zorunludur.")]
        [StringLength(50, ErrorMessage = "Rol adı en fazla 50 karakter olabilir.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(250, ErrorMessage = "Rol açıklaması en fazla 250 karakter olabilir.")]
        public string? Description { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace Staj_proje.DTO.Role
{
    public class RoleUpdateDto
    {
        [Required(ErrorMessage = "Rol adı zorunludur.")]
        [StringLength(50, ErrorMessage = "Rol adı en fazla 50 karakter olabilir.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(250, ErrorMessage = "Rol açıklaması en fazla 250 karakter olabilir.")]
        public string? Description { get; set; }

        // Güncellenecek izin ID listesi (Mevcut izinler bu liste ile senkronize edilir)
        public List<int> PermissionIds { get; set; } = new();
    }
}

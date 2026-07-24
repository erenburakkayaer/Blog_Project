using System.ComponentModel.DataAnnotations;

namespace BlogProject.API.DTO
{
    public class RoleCreateDto
    {
        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;
    }
}

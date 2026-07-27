using Microsoft.AspNetCore.Identity;

namespace Staj_proje.Entities
{
    public class Role : IdentityRole<int>
    {

        public string? Description { get; set; }
        public ICollection<RolePermission> RolePermissions { get; set; } = new HashSet<RolePermission>();
    }
}

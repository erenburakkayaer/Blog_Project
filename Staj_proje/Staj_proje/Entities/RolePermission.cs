namespace Staj_proje.Entities
{
    public class RolePermission
    {
            // Hangi Rol?
            public int RoleId { get; set; }
            public Role Role { get; set; }= null!;

            // Hangi Yetki?
            public int PermissionId { get; set; }
            public Permission Permission { get; set; } = null!;

    }
}

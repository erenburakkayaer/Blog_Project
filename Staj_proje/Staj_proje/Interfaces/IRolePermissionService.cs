using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface IRolePermissionService
    {
        // Create
        Task<bool> AssignPermissionToRoleAsync(int roleId, int permissionId);
        Task<bool> AssignMultiplePermissionsToRoleAsync(int roleId, List<int> permissionIds);
        
        // Read
        Task<List<Permission>> GetRolePermissionsAsync(int roleId);
        Task<List<string>> GetRolePermissionNamesAsync(int roleId);
        Task<List<Role>> GetPermissionRolesAsync(int permissionId);
        Task<List<RolePermission>> GetAllRolePermissionsAsync();
        Task<List<RolePermission>> GetRolePermissionsByRoleAsync(int roleId);
        Task<List<RolePermission>> GetRolePermissionsByPermissionAsync(int permissionId);
        
        // Validation & Check
        Task<bool> DoesRoleHavePermissionAsync(int roleId, int permissionId);
        Task<bool> DoesRoleHavePermissionByNameAsync(int roleId, string permissionName);
        Task<bool> IsRolePermissionExistsAsync(int roleId, int permissionId);
        Task<bool> IsRoleExistsAsync(int roleId);
        Task<bool> IsPermissionExistsAsync(int permissionId);
        
        // Delete
        Task<bool> RemovePermissionFromRoleAsync(int roleId, int permissionId);
        Task<bool> RemoveMultiplePermissionsFromRoleAsync(int roleId, List<int> permissionIds);
        Task<bool> RemoveAllPermissionsFromRoleAsync(int roleId);
        Task<bool> RemoveRoleFromAllPermissionsAsync(int roleId);
        Task<bool> RemovePermissionFromAllRolesAsync(int permissionId);
        
        // Replace/Update
        Task<bool> ReplaceRolePermissionsAsync(int roleId, List<int> newPermissionIds);
        
        // Statistics
        Task<int> GetRolePermissionCountAsync(int roleId);
        Task<int> GetPermissionRoleCountAsync(int permissionId);
        Task<int> GetTotalRolePermissionCountAsync();
        
        // Search & Filter
        Task<List<Permission>> GetRolePermissionsByGroupAsync(int roleId, string group);
        Task<List<Role>> GetRolesByPermissionGroupAsync(string group);
    }
}
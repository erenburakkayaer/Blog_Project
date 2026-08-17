using Staj_proje.Entities;

namespace Staj_proje.Services.Interfaces
{
    public interface IPermissionService
    {
        // Create
        Task<int> CreatePermissionAsync(string name, string displayName, string description, string group);
        
        // Read
        Task<Permission> GetPermissionByIdAsync(int id);
        Task<Permission> GetPermissionByNameAsync(string name);
        Task<List<Permission>> GetAllPermissionsAsync();
        Task<List<Permission>> GetPermissionsByGroupAsync(string group);
        Task<List<Permission>> GetPermissionsByRoleAsync(int roleId);
        Task<List<string>> GetPermissionNamesByRoleAsync(int roleId);
        Task<List<string>> GetPermissionNamesByUserAsync(int userId);
        
        // Update
        Task<bool> UpdatePermissionAsync(int id, string displayName, string description, string group);
        
        // Delete
        Task<bool> DeletePermissionAsync(int id);
        
        // Search & Filter
        Task<List<Permission>> SearchPermissionsByNameAsync(string keyword);
        Task<List<Permission>> SearchPermissionsByDisplayNameAsync(string keyword);
        
        // Group Operations
        Task<List<string>> GetPermissionGroupsAsync();
        Task<int> GetPermissionCountByGroupAsync(string group);
        
        // Validation & Check
        Task<bool> IsPermissionExistsAsync(int id);
        Task<bool> IsPermissionExistsByNameAsync(string name);
        Task<bool> IsPermissionNameUniqueAsync(string name, int? excludePermissionId = null);
        Task<bool> DoesUserHavePermissionAsync(int userId, string permissionName);
        Task<bool> DoesRoleHavePermissionAsync(int roleId, string permissionName);
        
        // Bulk Operations
        Task<bool> AssignPermissionsToRoleAsync(int roleId, List<int> permissionIds);
        Task<bool> RemovePermissionsFromRoleAsync(int roleId, List<int> permissionIds);
        Task<bool> RevokeAllPermissionsFromRoleAsync(int roleId);
    }
}
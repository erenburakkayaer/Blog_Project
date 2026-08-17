using Staj_proje.Entities;

namespace Staj_proje.Services.Interfaces
{
    public interface IRoleService
    {
        // Create
        Task<int> CreateRoleAsync(string name, string? description = null);
        
        // Read
        Task<Role> GetRoleByIdAsync(int id);
        Task<Role> GetRoleByNameAsync(string name);
        Task<List<Role>> GetAllRolesAsync();
        Task<List<Role>> GetRolesWithPermissionsAsync();
        Task<List<string>> GetRoleNamesAsync();
        Task<List<int>> GetRoleIdsAsync();
        
        // Update
        Task<bool> UpdateRoleAsync(int id, string name, string? description = null);
        Task<bool> UpdateRoleDescriptionAsync(int id, string description);
        
        // Delete
        Task<bool> DeleteRoleAsync(int id);
        Task<bool> DeleteRoleByNameAsync(string name);
        
        // Permission Management
        Task<List<Permission>> GetRolePermissionsAsync(int roleId);
        Task<List<string>> GetRolePermissionNamesAsync(int roleId);
        Task<bool> AssignPermissionToRoleAsync(int roleId, int permissionId);
        Task<bool> RemovePermissionFromRoleAsync(int roleId, int permissionId);
        Task<bool> AssignMultiplePermissionsToRoleAsync(int roleId, List<int> permissionIds);
        Task<bool> RemoveMultiplePermissionsFromRoleAsync(int roleId, List<int> permissionIds);
        Task<bool> ReplaceRolePermissionsAsync(int roleId, List<int> permissionIds);
        Task<bool> RemoveAllPermissionsFromRoleAsync(int roleId);
        
        // User-Role Management
        Task<List<User>> GetRoleUsersAsync(int roleId);
        Task<int> GetRoleUserCountAsync(int roleId);
        Task<bool> DoesRoleHaveUsersAsync(int roleId);
        
        // Validation & Check
        Task<bool> IsRoleExistsAsync(int id);
        Task<bool> IsRoleExistsByNameAsync(string name);
        Task<bool> IsRoleNameUniqueAsync(string name, int? excludeRoleId = null);
        Task<bool> DoesRoleHavePermissionAsync(int roleId, string permissionName);
        Task<bool> DoesRoleHavePermissionByIdAsync(int roleId, int permissionId);
        
        // Predefined Roles
        Task<bool> CreateDefaultRolesAsync();
        Task<Role> GetAdminRoleAsync();
        Task<Role> GetUserRoleAsync();
        Task<Role> GetGuestRoleAsync();
        
        // Search & Filter
        Task<List<Role>> SearchRolesByNameAsync(string keyword);
        Task<List<Role>> SearchRolesByDescriptionAsync(string keyword);
        
        // Statistics
        Task<int> GetTotalRoleCountAsync();
        Task<int> GetTotalPermissionCountByRoleAsync(int roleId);
    }
}
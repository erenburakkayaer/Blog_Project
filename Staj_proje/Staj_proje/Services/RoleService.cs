using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<Role> _roleManager;
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _context;

        public RoleService(
            RoleManager<Role> roleManager,
            UserManager<User> userManager,
            AppDbContext context)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _context = context;
        }

        #region Create

        public async Task<int> CreateRoleAsync(string name, string? description = null)
        {
            var role = new Role
            {
                Name = name,
                Description = description
            };

            var result = await _roleManager.CreateAsync(role);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Rol oluşturulamadı: {errors}");
            }

            return role.Id;
        }

        #endregion

        #region Read

        public async Task<Role> GetRoleByIdAsync(int id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
            {
                throw new KeyNotFoundException($"ID değeri {id} olan rol bulunamadı.");
            }

            return role;
        }

        public async Task<Role> GetRoleByNameAsync(string name)
        {
            var role = await _roleManager.FindByNameAsync(name);
            if (role == null)
            {
                throw new KeyNotFoundException($"'{name}' adında bir rol bulunamadı.");
            }

            return role;
        }

        public async Task<List<Role>> GetAllRolesAsync()
        {
            return await _roleManager.Roles.ToListAsync();
        }

        public async Task<List<Role>> GetRolesWithPermissionsAsync()
        {
            return await _roleManager.Roles
                .Include(r => r.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
                .ToListAsync();
        }

        public async Task<List<string>> GetRoleNamesAsync()
        {
            return await _roleManager.Roles
                .Where(r => r.Name != null)
                .Select(r => r.Name!)
                .ToListAsync();
        }

        public async Task<List<int>> GetRoleIdsAsync()
        {
            return await _roleManager.Roles
                .Select(r => r.Id)
                .ToListAsync();
        }

        #endregion

        #region Update

        public async Task<bool> UpdateRoleAsync(int id, string name, string? description = null)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null) return false;

            role.Name = name;
            role.Description = description;

            var result = await _roleManager.UpdateAsync(role);
            return result.Succeeded;
        }

        public async Task<bool> UpdateRoleDescriptionAsync(int id, string description)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null) return false;

            role.Description = description;

            var result = await _roleManager.UpdateAsync(role);
            return result.Succeeded;
        }

        #endregion

        #region Delete

        public async Task<bool> DeleteRoleAsync(int id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null) return false;

            var result = await _roleManager.DeleteAsync(role);
            return result.Succeeded;
        }

        public async Task<bool> DeleteRoleByNameAsync(string name)
        {
            var role = await _roleManager.FindByNameAsync(name);
            if (role == null) return false;

            var result = await _roleManager.DeleteAsync(role);
            return result.Succeeded;
        }

        #endregion

        #region Permission Management

        public async Task<List<Permission>> GetRolePermissionsAsync(int roleId)
        {
            return await _context.Set<RolePermission>()
                .Where(rp => rp.RoleId == roleId)
                .Select(rp => rp.Permission)
                .ToListAsync();
        }

        public async Task<List<string>> GetRolePermissionNamesAsync(int roleId)
        {
            return await _context.Set<RolePermission>()
                .Where(rp => rp.RoleId == roleId)
                .Select(rp => rp.Permission.Name)
                .ToListAsync();
        }

        public async Task<bool> AssignPermissionToRoleAsync(int roleId, int permissionId)
        {
            var exists = await _context.Set<RolePermission>()
                .AnyAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);

            if (exists) return true;

            var rolePermission = new RolePermission
            {
                RoleId = roleId,
                PermissionId = permissionId
            };

            await _context.Set<RolePermission>().AddAsync(rolePermission);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemovePermissionFromRoleAsync(int roleId, int permissionId)
        {
            var rolePermission = await _context.Set<RolePermission>()
                .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);

            if (rolePermission == null) return false;

            _context.Set<RolePermission>().Remove(rolePermission);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> AssignMultiplePermissionsToRoleAsync(int roleId, List<int> permissionIds)
        {
            if (permissionIds == null || !permissionIds.Any()) return true;

            var existingPermissionIds = await _context.Set<RolePermission>()
                .Where(rp => rp.RoleId == roleId)
                .Select(rp => rp.PermissionId)
                .ToListAsync();

            var newPermissionIds = permissionIds.Except(existingPermissionIds).Distinct();

            var newRolePermissions = newPermissionIds.Select(pId => new RolePermission
            {
                RoleId = roleId,
                PermissionId = pId
            });

            await _context.Set<RolePermission>().AddRangeAsync(newRolePermissions);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveMultiplePermissionsFromRoleAsync(int roleId, List<int> permissionIds)
        {
            if (permissionIds == null || !permissionIds.Any()) return true;

            var toRemove = await _context.Set<RolePermission>()
                .Where(rp => rp.RoleId == roleId && permissionIds.Contains(rp.PermissionId))
                .ToListAsync();

            if (!toRemove.Any()) return true;

            _context.Set<RolePermission>().RemoveRange(toRemove);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ReplaceRolePermissionsAsync(int roleId, List<int> permissionIds)
        {
            permissionIds ??= new List<int>();

            var currentPermissions = await _context.Set<RolePermission>()
                .Where(rp => rp.RoleId == roleId)
                .ToListAsync();

            _context.Set<RolePermission>().RemoveRange(currentPermissions);

            var newRolePermissions = permissionIds.Distinct().Select(pId => new RolePermission
            {
                RoleId = roleId,
                PermissionId = pId
            });

            await _context.Set<RolePermission>().AddRangeAsync(newRolePermissions);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveAllPermissionsFromRoleAsync(int roleId)
        {
            var permissions = await _context.Set<RolePermission>()
                .Where(rp => rp.RoleId == roleId)
                .ToListAsync();

            if (!permissions.Any()) return true;

            _context.Set<RolePermission>().RemoveRange(permissions);
            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region User-Role Management

        public async Task<List<User>> GetRoleUsersAsync(int roleId)
        {
            var role = await GetRoleByIdAsync(roleId);
            var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name!);
            return usersInRole.ToList();
        }

        public async Task<int> GetRoleUserCountAsync(int roleId)
        {
            var role = await GetRoleByIdAsync(roleId);
            var users = await _userManager.GetUsersInRoleAsync(role.Name!);
            return users.Count;
        }

        public async Task<bool> DoesRoleHaveUsersAsync(int roleId)
        {
            var count = await GetRoleUserCountAsync(roleId);
            return count > 0;
        }

        #endregion

        #region Validation & Check

        public async Task<bool> IsRoleExistsAsync(int id)
        {
            return await _roleManager.Roles.AnyAsync(r => r.Id == id);
        }

        public async Task<bool> IsRoleExistsByNameAsync(string name)
        {
            return await _roleManager.RoleExistsAsync(name);
        }

        public async Task<bool> IsRoleNameUniqueAsync(string name, int? excludeRoleId = null)
        {
            return !await _roleManager.Roles.AnyAsync(r => 
                r.Name == name && (!excludeRoleId.HasValue || r.Id != excludeRoleId.Value));
        }

        public async Task<bool> DoesRoleHavePermissionAsync(int roleId, string permissionName)
        {
            return await _context.Set<RolePermission>()
                .AnyAsync(rp => rp.RoleId == roleId && rp.Permission.Name == permissionName);
        }

        public async Task<bool> DoesRoleHavePermissionByIdAsync(int roleId, int permissionId)
        {
            return await _context.Set<RolePermission>()
                .AnyAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);
        }

        #endregion

        #region Predefined Roles

        public async Task<bool> CreateDefaultRolesAsync()
        {
            string[] defaultRoles = { "Admin", "User", "Guest" };

            foreach (var roleName in defaultRoles)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    var result = await _roleManager.CreateAsync(new Role
                    {
                        Name = roleName,
                        Description = $"{roleName} varsayılan sistem rolü."
                    });

                    if (!result.Succeeded) return false;
                }
            }

            return true;
        }

        public async Task<Role> GetAdminRoleAsync()
        {
            return await GetRoleByNameAsync("Admin");
        }

        public async Task<Role> GetUserRoleAsync()
        {
            return await GetRoleByNameAsync("User");
        }

        public async Task<Role> GetGuestRoleAsync()
        {
            return await GetRoleByNameAsync("Guest");
        }

        #endregion

        #region Search & Filter

        public async Task<List<Role>> SearchRolesByNameAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return await GetAllRolesAsync();

            return await _roleManager.Roles
                .Where(r => r.Name != null && r.Name.Contains(keyword))
                .ToListAsync();
        }

        public async Task<List<Role>> SearchRolesByDescriptionAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return await GetAllRolesAsync();

            return await _roleManager.Roles
                .Where(r => r.Description != null && r.Description.Contains(keyword))
                .ToListAsync();
        }

        #endregion

        #region Statistics

        public async Task<int> GetTotalRoleCountAsync()
        {
            return await _roleManager.Roles.CountAsync();
        }

        public async Task<int> GetTotalPermissionCountByRoleAsync(int roleId)
        {
            return await _context.Set<RolePermission>()
                .CountAsync(rp => rp.RoleId == roleId);
        }

        #endregion
    }
}
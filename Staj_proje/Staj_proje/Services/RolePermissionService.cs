using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Services
{
    public class RolePermissionService : IRolePermissionService
    {
        private readonly AppDbContext _context;

        public RolePermissionService(AppDbContext context)
        {
            _context = context;
        }

        #region Create

        public async Task<bool> AssignPermissionToRoleAsync(int roleId, int permissionId)
        {
            var exists = await IsRolePermissionExistsAsync(roleId, permissionId);
            if (exists) return true;

            var rolePermission = new RolePermission
            {
                RoleId = roleId,
                PermissionId = permissionId
            };

            await _context.Set<RolePermission>().AddAsync(rolePermission);
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

        #endregion

        #region Read

        public async Task<List<Permission>> GetRolePermissionsAsync(int roleId)
        {
            return await _context.Set<RolePermission>()
                .AsNoTracking()
                .Where(rp => rp.RoleId == roleId)
                .Select(rp => rp.Permission)
                .ToListAsync();
        }

        public async Task<List<string>> GetRolePermissionNamesAsync(int roleId)
        {
            return await _context.Set<RolePermission>()
                .AsNoTracking()
                .Where(rp => rp.RoleId == roleId)
                .Select(rp => rp.Permission.Name)
                .ToListAsync();
        }

        public async Task<List<Role>> GetPermissionRolesAsync(int permissionId)
        {
            return await _context.Set<RolePermission>()
                .AsNoTracking()
                .Where(rp => rp.PermissionId == permissionId)
                .Select(rp => rp.Role)
                .ToListAsync();
        }

        public async Task<List<RolePermission>> GetAllRolePermissionsAsync()
        {
            return await _context.Set<RolePermission>()
                .AsNoTracking()
                .Include(rp => rp.Role)
                .Include(rp => rp.Permission)
                .ToListAsync();
        }

        public async Task<List<RolePermission>> GetRolePermissionsByRoleAsync(int roleId)
        {
            return await _context.Set<RolePermission>()
                .AsNoTracking()
                .Where(rp => rp.RoleId == roleId)
                .Include(rp => rp.Permission)
                .ToListAsync();
        }

        public async Task<List<RolePermission>> GetRolePermissionsByPermissionAsync(int permissionId)
        {
            return await _context.Set<RolePermission>()
                .AsNoTracking()
                .Where(rp => rp.PermissionId == permissionId)
                .Include(rp => rp.Role)
                .ToListAsync();
        }

        #endregion

        #region Validation & Check

        public async Task<bool> DoesRoleHavePermissionAsync(int roleId, int permissionId)
        {
            return await IsRolePermissionExistsAsync(roleId, permissionId);
        }

        public async Task<bool> DoesRoleHavePermissionByNameAsync(int roleId, string permissionName)
        {
            return await _context.Set<RolePermission>()
                .AnyAsync(rp => rp.RoleId == roleId && rp.Permission.Name == permissionName);
        }

        public async Task<bool> IsRolePermissionExistsAsync(int roleId, int permissionId)
        {
            return await _context.Set<RolePermission>()
                .AnyAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);
        }

        public async Task<bool> IsRoleExistsAsync(int roleId)
        {
            return await _context.Set<Role>()
                .AnyAsync(r => r.Id == roleId);
        }

        public async Task<bool> IsPermissionExistsAsync(int permissionId)
        {
            return await _context.Set<Permission>()
                .AnyAsync(p => p.Id == permissionId);
        }

        #endregion

        #region Delete

        public async Task<bool> RemovePermissionFromRoleAsync(int roleId, int permissionId)
        {
            var rolePermission = await _context.Set<RolePermission>()
                .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);

            if (rolePermission == null) return false;

            _context.Set<RolePermission>().Remove(rolePermission);
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

        public async Task<bool> RemoveAllPermissionsFromRoleAsync(int roleId)
        {
            var permissions = await _context.Set<RolePermission>()
                .Where(rp => rp.RoleId == roleId)
                .ToListAsync();

            if (!permissions.Any()) return true;

            _context.Set<RolePermission>().RemoveRange(permissions);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveRoleFromAllPermissionsAsync(int roleId)
        {
            return await RemoveAllPermissionsFromRoleAsync(roleId);
        }

        public async Task<bool> RemovePermissionFromAllRolesAsync(int permissionId)
        {
            var rolePermissions = await _context.Set<RolePermission>()
                .Where(rp => rp.PermissionId == permissionId)
                .ToListAsync();

            if (!rolePermissions.Any()) return true;

            _context.Set<RolePermission>().RemoveRange(rolePermissions);
            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region Replace / Update

        public async Task<bool> ReplaceRolePermissionsAsync(int roleId, List<int> newPermissionIds)
        {
            newPermissionIds ??= new List<int>();

            var currentPermissions = await _context.Set<RolePermission>()
                .Where(rp => rp.RoleId == roleId)
                .ToListAsync();

            _context.Set<RolePermission>().RemoveRange(currentPermissions);

            var newRolePermissions = newPermissionIds.Distinct().Select(pId => new RolePermission
            {
                RoleId = roleId,
                PermissionId = pId
            });

            await _context.Set<RolePermission>().AddRangeAsync(newRolePermissions);
            return await _context.SaveChangesAsync() > 0;
        }

        #endregion

        #region Statistics

        public async Task<int> GetRolePermissionCountAsync(int roleId)
        {
            return await _context.Set<RolePermission>()
                .CountAsync(rp => rp.RoleId == roleId);
        }

        public async Task<int> GetPermissionRoleCountAsync(int permissionId)
        {
            return await _context.Set<RolePermission>()
                .CountAsync(rp => rp.PermissionId == permissionId);
        }

        public async Task<int> GetTotalRolePermissionCountAsync()
        {
            return await _context.Set<RolePermission>()
                .CountAsync();
        }

        #endregion

        #region Search & Filter

        public async Task<List<Permission>> GetRolePermissionsByGroupAsync(int roleId, string group)
        {
            if (string.IsNullOrWhiteSpace(group))
                return await GetRolePermissionsAsync(roleId);

            return await _context.Set<RolePermission>()
                .AsNoTracking()
                .Where(rp => rp.RoleId == roleId && rp.Permission.Group == group)
                .Select(rp => rp.Permission)
                .ToListAsync();
        }

        public async Task<List<Role>> GetRolesByPermissionGroupAsync(string group)
        {
            if (string.IsNullOrWhiteSpace(group))
                return new List<Role>();

            return await _context.Set<RolePermission>()
                .AsNoTracking()
                .Where(rp => rp.Permission.Group == group)
                .Select(rp => rp.Role)
                .Distinct()
                .ToListAsync();
        }

        #endregion
    }
}
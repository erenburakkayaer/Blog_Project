using Staj_proje.DTO.User;
using Staj_proje.Entities;

namespace Staj_proje.Interfaces
{
    public interface IUserService
    {
        // Create & Registration
        Task<int> CreateUserAsync(CreateUserDto createUserDto);
        Task<bool> RegisterUserAsync(CreateUserDto registerDto);
        
        // Authentication
        Task<(bool Success, string Message, User? User)> LoginAsync(LoginUserDto loginDto);
        Task<bool> LogoutAsync(int userId);
        
        // Read
        Task<UserResponseDto> GetUserByIdAsync(int id);
        Task<User> GetUserEntityByIdAsync(int id);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByUserNameAsync(string userName);
        Task<UserResponseDto> GetCurrentUserAsync(int userId);
        Task<List<UserResponseDto>> GetAllUsersAsync(int pageNumber = 1, int pageSize = 20);
        Task<List<UserResponseDto>> GetUsersByRoleAsync(int roleId, int pageNumber = 1, int pageSize = 20);
        Task<List<UserResponseDto>> GetActiveUsersAsync(int pageNumber = 1, int pageSize = 20);
        
        // Update
        Task<bool> UpdateUserAsync(int id, UpdateUserdto updateUserDto);
        Task<bool> UpdateFirstNameAsync(int id, string firstName);
        Task<bool> UpdateLastNameAsync(int id, string lastName);
        Task<bool> UpdatePhoneNumberAsync(int id, string phoneNumber);
        Task<bool> UpdateJobTitleAsync(int id, string jobTitle);
        Task<bool> UpdateAvatarAsync(int id, int fileAssetId);
        
        // Password Management
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
        Task<bool> ResetPasswordAsync(int userId, string newPassword);
        Task<bool> VerifyPasswordAsync(int userId, string password);
        
        // Email Management
        Task<bool> ChangeEmailAsync(int userId, ChangeEmailDto changeEmailDto);
        Task<bool> ConfirmEmailAsync(int userId, string token);
        Task<bool> ResendEmailConfirmationAsync(int userId);
        Task<string> GenerateEmailConfirmationTokenAsync(int userId);
        
        // Role Management
        Task<bool> AssignRoleToUserAsync(int userId, int roleId);
        Task<bool> AssignRolesToUserAsync(int userId, List<int> roleIds);
        Task<bool> RemoveRoleFromUserAsync(int userId, int roleId);
        Task<bool> RemoveAllRolesFromUserAsync(int userId);
        Task<List<Role>> GetUserRolesAsync(int userId);
        Task<List<string>> GetUserRoleNamesAsync(int userId);
        
        // Permission Check
        Task<bool> DoesUserHavePermissionAsync(int userId, string permissionName);
        Task<bool> DoesUserHaveRoleAsync(int userId, int roleId);
        Task<bool> DoesUserHaveRoleByNameAsync(int userId, string roleName);
        
        // Account Status
        Task<bool> LockUserAsync(int userId);
        Task<bool> UnlockUserAsync(int userId);
        Task<bool> IsUserLockedAsync(int userId);
        Task<bool> IsUserEmailConfirmedAsync(int userId);
        Task<bool> IsUserPhoneNumberConfirmedAsync(int userId);
        
        // Delete
        Task<bool> DeleteUserAsync(int id);
        Task<bool> PermanentlyDeleteUserAsync(int id);
        Task<bool> SoftDeleteUserAsync(int id);
        
        // Search & Filter
        Task<List<UserResponseDto>> SearchUsersByFirstNameAsync(string firstName, int pageNumber = 1, int pageSize = 20);
        Task<List<UserResponseDto>> SearchUsersByLastNameAsync(string lastName, int pageNumber = 1, int pageSize = 20);
        Task<List<UserResponseDto>> SearchUsersByEmailAsync(string email, int pageNumber = 1, int pageSize = 20);
        Task<List<UserResponseDto>> SearchUsersByUserNameAsync(string userName, int pageNumber = 1, int pageSize = 20);
        Task<List<UserResponseDto>> SearchUsersByJobTitleAsync(string jobTitle, int pageNumber = 1, int pageSize = 20);
        
        // Statistics
        Task<int> GetTotalUserCountAsync();
        Task<int> GetActiveUserCountAsync();
        Task<int> GetLockedUserCountAsync();
        Task<int> GetUnconfirmedEmailUserCountAsync();
        Task<int> GetUserCountByRoleAsync(int roleId);
        
        // Validation & Check
        Task<bool> IsUserExistsAsync(int id);
        Task<bool> IsUserExistsByEmailAsync(string email);
        Task<bool> IsUserExistsByUserNameAsync(string userName);
        Task<bool> IsEmailUniqueAsync(string email, int? excludeUserId = null);
        Task<bool> IsUserNameUniqueAsync(string userName, int? excludeUserId = null);
        Task<bool> IsPasswordStrongAsync(string password);
    }
}
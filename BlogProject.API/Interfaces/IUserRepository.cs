using BlogProject.API.Entities;

namespace BlogProject.API.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByUsernameWithRoleAsync(string username);
        Task<User?> GetByIdWithRoleAsync(int id);
        Task<IEnumerable<User>> GetAllWithRoleAsync();
    }
}

using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    // İş kuralları: kullanıcı adı/e-posta benzersizliği, parola hash'leme, rol slug<->RoleId çözümleme
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IGenericRepository<Role> _roleRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IGenericRepository<Role> roleRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _mapper = mapper;
        }

        // frontend/samet "admin"/"editor"/"author" slug'ı gönderiyor, backend rolleri Türkçe (Admin/Editor/Yazar)
        private async Task<int> ResolveRoleIdAsync(string roleSlug)
        {
            var roleName = roleSlug?.ToLowerInvariant() switch
            {
                "admin" => RoleNames.Admin,
                "author" => RoleNames.Yazar,
                "editor" => RoleNames.Editor,
                _ => RoleNames.Editor
            };

            var roles = await _roleRepository.GetAllAsync();
            var role = roles.FirstOrDefault(r => r.Name == roleName)
                ?? throw new InvalidOperationException($"'{roleName}' rolü veritabanında bulunamadı.");
            return role.Id;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _userRepository.GetAllWithRoleAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<PagedResultDto<UserDto>> GetPagedAsync(int page, int pageSize, string? search = null)
        {
            var (users, totalCount) = await _userRepository.GetPagedAsync(page, pageSize, search);
            return new PagedResultDto<UserDto>
            {
                Items = _mapper.Map<IEnumerable<UserDto>>(users),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdWithRoleAsync(id);
            return user is null ? null : _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> CreateAsync(UserCreateDto dto)
        {
            var existing = await _userRepository.GetByUsernameAsync(dto.Username);
            if (existing is not null)
                throw new InvalidOperationException($"'{dto.Username}' kullanıcı adı zaten kullanılıyor.");

            // frontend/samet UserModal.jsx şifre toplamıyor — boş geldiyse geçici şifre üret
            var password = string.IsNullOrWhiteSpace(dto.Password)
                ? Guid.NewGuid().ToString("N")[..12]
                : dto.Password;

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = PasswordHasher.Hash(password),
                RoleId = await ResolveRoleIdAsync(dto.Role),
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> UpdateAsync(int id, UserUpdateDto dto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user is null) return false;

            user.Username = dto.Username;
            user.Email = dto.Email;
            user.RoleId = await ResolveRoleIdAsync(dto.Role);
            user.IsActive = dto.Status == "active";

            _userRepository.Update(user);
            return await _userRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user is null) return false;

            _userRepository.Remove(user);
            return await _userRepository.SaveChangesAsync();
        }
    }
}

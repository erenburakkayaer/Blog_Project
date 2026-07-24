using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    // İş kuralları: kullanıcı adı/e-posta benzersizliği, parola hash'leme
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
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

            var user = _mapper.Map<User>(dto);
            user.PasswordHash = PasswordHasher.Hash(dto.Password);
            user.CreatedAt = DateTime.UtcNow;
            user.IsActive = true;

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            return _mapper.Map<UserDto>(user);
        }

        public async Task<bool> UpdateAsync(int id, UserUpdateDto dto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user is null) return false;

            _mapper.Map(dto, user);

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

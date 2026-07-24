using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    public class RoleService : IRoleService
    {
        private readonly IGenericRepository<Role> _roleRepository;
        private readonly IMapper _mapper;

        public RoleService(IGenericRepository<Role> roleRepository, IMapper mapper)
        {
            _roleRepository = roleRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<RoleDto>> GetAllAsync()
        {
            var roles = await _roleRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<RoleDto>>(roles);
        }

        public async Task<RoleDto?> GetByIdAsync(int id)
        {
            var role = await _roleRepository.GetByIdAsync(id);
            return role is null ? null : _mapper.Map<RoleDto>(role);
        }

        public async Task<RoleDto> CreateAsync(RoleCreateDto dto)
        {
            var existing = await _roleRepository.GetAllAsync();
            if (existing.Any(r => r.Name.Equals(dto.Name, StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException($"'{dto.Name}' adında bir rol zaten var.");

            var role = _mapper.Map<Role>(dto);
            await _roleRepository.AddAsync(role);
            await _roleRepository.SaveChangesAsync();

            return _mapper.Map<RoleDto>(role);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var role = await _roleRepository.GetByIdAsync(id);
            if (role is null) return false;

            _roleRepository.Remove(role);
            return await _roleRepository.SaveChangesAsync();
        }
    }
}

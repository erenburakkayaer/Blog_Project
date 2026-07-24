using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    public class GenericCrudService<TEntity, TDto, TCreateDto, TUpdateDto>
        : IGenericCrudService<TDto, TCreateDto, TUpdateDto>
        where TEntity : class
        where TDto : class
        where TCreateDto : class
        where TUpdateDto : class
    {
        private readonly IGenericRepository<TEntity> _repository;
        private readonly IMapper _mapper;

        public GenericCrudService(IGenericRepository<TEntity> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<TDto>>(entities);
        }

        public async Task<PagedResultDto<TDto>> GetPagedAsync(int page, int pageSize)
        {
            var (entities, totalCount) = await _repository.GetPagedAsync(page, pageSize);
            return new PagedResultDto<TDto>
            {
                Items = _mapper.Map<IEnumerable<TDto>>(entities),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<TDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity is null ? null : _mapper.Map<TDto>(entity);
        }

        public async Task<TDto> CreateAsync(TCreateDto dto)
        {
            var entity = _mapper.Map<TEntity>(dto);
            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();
            return _mapper.Map<TDto>(entity);
        }

        public async Task<bool> UpdateAsync(int id, TUpdateDto dto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity is null) return false;

            _mapper.Map(dto, entity);
            _repository.Update(entity);
            return await _repository.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity is null) return false;

            _repository.Remove(entity);
            return await _repository.SaveChangesAsync();
        }
    }
}

using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    // Özel iş kuralı gerektirmeyen (Sliders, Pages, Gallery vb.) basit CRUD modülleri için
    // ortak business katmanı. Blog/User/Auth gibi gerçek iş kuralı olan modüller kendi
    // özel servisini (IBlogService, IUserService, IAuthService) kullanmaya devam eder.
    public interface IGenericCrudService<TDto, TCreateDto, TUpdateDto>
        where TDto : class
        where TCreateDto : class
        where TUpdateDto : class
    {
        Task<IEnumerable<TDto>> GetAllAsync();
        Task<PagedResultDto<TDto>> GetPagedAsync(int page, int pageSize);
        Task<TDto?> GetByIdAsync(int id);
        Task<TDto> CreateAsync(TCreateDto dto);
        Task<bool> UpdateAsync(int id, TUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

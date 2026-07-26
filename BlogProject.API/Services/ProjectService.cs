using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Helpers;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    // İş kuralları: slug üretimi, kategori adını çözümleme/oluşturma
    public class ProjectService : IProjectService
    {
        private readonly IGenericRepository<Project> _projectRepository;
        private readonly IGenericRepository<Category> _categoryRepository;
        private readonly IMapper _mapper;

        public ProjectService(
            IGenericRepository<Project> projectRepository,
            IGenericRepository<Category> categoryRepository,
            IMapper mapper)
        {
            _projectRepository = projectRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<PagedResultDto<ProjectDto>> GetPagedAsync(int page, int pageSize, string? search = null)
        {
            var (projects, totalCount) = await _projectRepository.GetPagedAsync(page, pageSize, search);
            return new PagedResultDto<ProjectDto>
            {
                Items = _mapper.Map<IEnumerable<ProjectDto>>(projects),
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        public async Task<ProjectDto?> GetByIdAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            return project is null ? null : _mapper.Map<ProjectDto>(project);
        }

        public async Task<ProjectDto> CreateAsync(ProjectCreateDto dto)
        {
            var project = _mapper.Map<Project>(dto);
            project.CategoryId = await ResolveCategoryIdAsync(dto.Category);
            project.Slug = SlugGenerator.Generate(dto.Title);
            project.CreatedAt = DateTime.UtcNow;

            await _projectRepository.AddAsync(project);
            await _projectRepository.SaveChangesAsync();

            var saved = await _projectRepository.GetByIdAsync(project.Id);
            return _mapper.Map<ProjectDto>(saved);
        }

        public async Task<bool> UpdateAsync(int id, ProjectUpdateDto dto)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project is null) return false;

            project.Title = dto.Title;
            project.Summary = dto.Summary;
            project.Description = dto.Description;
            project.Client = dto.Client;
            project.Technologies = dto.Technologies;
            project.CoverImage = dto.CoverImage;
            project.ProjectUrl = dto.ProjectUrl;
            project.RepositoryUrl = dto.RepositoryUrl;
            project.StartDate = dto.StartDate;
            project.EndDate = dto.EndDate;
            project.Status = dto.Status;
            project.Featured = dto.Featured;
            project.CategoryId = await ResolveCategoryIdAsync(dto.Category);
            project.UpdatedAt = DateTime.UtcNow;

            _projectRepository.Update(project);
            return await _projectRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var project = await _projectRepository.GetByIdAsync(id);
            if (project is null) return false;

            _projectRepository.Remove(project);
            return await _projectRepository.SaveChangesAsync();
        }

        // Frontend'in sabit kategori listesi serbest metin geliyor — DB'de eşleşen
        // Category yoksa otomatik oluşturulur, varsa mevcut Id kullanılır
        private async Task<int> ResolveCategoryIdAsync(string categoryName)
        {
            var categories = await _categoryRepository.GetAllAsync();
            var existing = categories.FirstOrDefault(c =>
                c.Type == "Project" && c.Name.Equals(categoryName, StringComparison.OrdinalIgnoreCase));

            if (existing is not null) return existing.Id;

            var category = new Category { Name = categoryName, Slug = SlugGenerator.Generate(categoryName), Type = "Project" };
            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();

            return category.Id;
        }
    }
}

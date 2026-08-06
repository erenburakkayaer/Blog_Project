using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Repositories
{
    public class ProjectRepository : GenericRepository<Project>, IProjectRepository
    {
        public ProjectRepository(AppDbContext context) : base(context) { }

        public async Task<Project?> GetBySlugWithDetailsAsync(string slug)
        {
            return await _context.Projects
                .Where(p => p.Slug == slug && p.IsActive && !p.IsDeleted)
                .Include(p => p.Category)
                .Include(p => p.CoverImageUrl)
                .Include(p => p.ProjectImages.Where(pi => !pi.IsDeleted))
                    .ThenInclude(pi => pi.FileAsset)
                .FirstOrDefaultAsync();
        }

        public async Task<Project?> GetProjectWithDetailsByIdAsync(int id)
        {
            return await _context.Projects
                .Where(p => p.Id == id && !p.IsDeleted)
                .Include(p => p.Category)
                .Include(p => p.CoverImageUrl)
                .Include(p => p.ProjectImages.Where(pi => !pi.IsDeleted))
                    .ThenInclude(pi => pi.FileAsset)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Project>> GetFeaturedProjectsWithDetailsAsync()
        {
            return await _context.Projects
                .Where(p => p.IsFeatured && p.IsActive && !p.IsDeleted)
                .Include(p => p.Category)
                .Include(p => p.CoverImageUrl)
                .OrderBy(p => p.DisplayOrder)
                .ThenByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Project>> GetProjectsByCategoryIdAsync(int categoryId)
        {
            return await _context.Projects
                .Where(p => p.CategoryId == categoryId && p.IsActive && !p.IsDeleted)
                .Include(p => p.CoverImageUrl)
                .OrderBy(p => p.DisplayOrder)
                .ToListAsync();
        }
    }
}
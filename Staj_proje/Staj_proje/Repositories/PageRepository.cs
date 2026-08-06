using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Repositories
{
    public class PageRepository : GenericRepository<Page>, IPageRepository
    {
        public PageRepository(AppDbContext context) : base(context) { }

        public async Task<Page?> GetBySlugAsync(string slug)
        {
            return await _context.Pages
                .Where(p => p.Slug == slug && p.IsActive && !p.IsDeleted)
                .Include(p => p.SeoSetting)
                .Include(p => p.BannerImageAsset)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Page>> GetHeaderPagesAsync()
        {
            return await _context.Pages
                .Where(p => p.ShowInHeader && p.IsActive && !p.IsDeleted)
                .OrderBy(p => p.DisplayOrder)
                .ToListAsync();
        }

        public async Task<List<Page>> GetFooterPagesAsync()
        {
            return await _context.Pages
                .Where(p => p.ShowInFooter && p.IsActive && !p.IsDeleted)
                .OrderBy(p => p.DisplayOrder)
                .ToListAsync();
        }
    }
}
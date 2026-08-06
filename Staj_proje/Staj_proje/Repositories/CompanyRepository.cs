using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Repositories
{
    public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
    {
        public CompanyRepository(AppDbContext context) : base(context) { }

        public async Task<Company?> GetCompanyWithDetailsByIdAsync(int id)
        {
            return await _context.Companies
                .Where(c => c.Id == id)
                .Include(c => c.LogoFileAsset)
                .Include(c => c.GalleryItems.Where(g => g.IsActive && !g.IsDeleted))
                    .ThenInclude(g => g.FileAsset)
                .Include(c => c.Services.Where(s => s.IsActive && !s.IsDeleted))
                .Include(c => c.Careers.Where(car => car.IsActive && !car.IsDeleted))
                .FirstOrDefaultAsync();
        }

        public async Task<List<Company>> GetActiveCompaniesWithLogosAsync()
        {
            return await _context.Companies
                .Include(c => c.LogoFileAsset)
                .OrderBy(c => c.Name)
                .ToListAsync();
        }
    }
}
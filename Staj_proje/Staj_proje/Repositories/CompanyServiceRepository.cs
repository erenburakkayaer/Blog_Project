using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Repositories
{
    public class CompanyServiceRepository : GenericRepository<CompanyService>, ICompanyServiceRepository
    {
        public CompanyServiceRepository(AppDbContext context) : base(context) { }

        public async Task<List<CompanyService>> GetFeaturedServicesWithDetailsAsync()
        {
            return await _context.Set<CompanyService>()
                .Where(s => s.IsFeatured && s.IsActive && !s.IsDeleted)
                .Include(s => s.Company)
                .Include(s => s.Category)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<CompanyService?> GetServiceWithDetailsByIdAsync(int id)
        {
            return await _context.Set<CompanyService>()
                .Where(s => s.Id == id && !s.IsDeleted)
                .Include(s => s.Company)
                .Include(s => s.Category)
                .FirstOrDefaultAsync();
        }

        public async Task<List<CompanyService>> GetServicesByCategoryIdAsync(int categoryId)
        {
            return await _context.Set<CompanyService>()
                .Where(s => s.CategoryId == categoryId && s.IsActive && !s.IsDeleted)
                .Include(s => s.Company)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<CompanyService>> GetServicesByCompanyIdAsync(int companyId)
        {
            return await _context.Set<CompanyService>()
                .Where(s => s.CompanyId == companyId && s.IsActive && !s.IsDeleted)
                .Include(s => s.Category)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }
    }
}
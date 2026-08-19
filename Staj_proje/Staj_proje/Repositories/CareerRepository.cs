using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Repositories
{
    public class CareerRepository : GenericRepository<Career>, ICareerRepository
    {
        public CareerRepository(AppDbContext context) : base(context) { }

        public async Task<List<Career>> GetAllCareersWithDetailsAsync()
        {
            return await _context.Careers
                .Where(c => !c.IsDeleted)
                .Include(c => c.Company)
                .Include(c => c.Category)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Career>> GetActiveCareersWithDetailsAsync()
        {
            return await _context.Careers
                .Where(c => c.IsActive && !c.IsDeleted && (c.ExpirationDate == null || c.ExpirationDate > DateTime.UtcNow))
                .Include(c => c.Company)
                .Include(c => c.Category)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Career?> GetCareerWithDetailsByIdAsync(int id)
        {
            return await _context.Careers
                .Where(c => c.Id == id && !c.IsDeleted)
                .Include(c => c.Company)
                .Include(c => c.Category)
                .Include(c => c.Applications.Where(a => !a.IsDeleted))
                .FirstOrDefaultAsync();
        }

        public async Task<List<Career>> GetCareersByCompanyIdAsync(int companyId)
        {
            return await _context.Careers
                .Where(c => c.CompanyId == companyId && !c.IsDeleted)
                .Include(c => c.Company)
                .Include(c => c.Category)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Career>> GetCareersByCategoryIdAsync(int categoryId)
        {
            return await _context.Careers
                .Where(c => c.CategoryId == categoryId && !c.IsDeleted)
                .Include(c => c.Company)
                .Include(c => c.Category)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Career>> GetCareersByEmploymentTypeAsync(EmploymentType employmentType)
        {
            return await _context.Careers
                .Where(c => c.EmploymentType == employmentType && c.IsActive && !c.IsDeleted)
                .Include(c => c.Company)
                .Include(c => c.Category)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Career>> GetExpiredCareersWithDetailsAsync()
        {
            return await _context.Careers
                .Where(c => !c.IsDeleted && c.ExpirationDate != null && c.ExpirationDate <= DateTime.UtcNow)
                .Include(c => c.Company)
                .Include(c => c.Category)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }
    }
}
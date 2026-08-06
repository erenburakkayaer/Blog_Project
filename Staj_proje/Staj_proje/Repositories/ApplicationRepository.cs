using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Repositories
{
    public class ApplicationRepository : GenericRepository<Application>, IApplicationRepository
    {
        public ApplicationRepository(AppDbContext context) : base(context) { }

        public async Task<Application?> GetApplicationWithDetailsByIdAsync(int id)
        {
            return await _context.Applications
                .Where(a => a.Id == id && !a.IsDeleted)
                .Include(a => a.Career)
                .Include(a => a.User)
                .Include(a => a.ReviewedByUser)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Application>> GetPendingApplicationsWithDetailsAsync()
        {
            return await _context.Applications
                .Where(a => (a.Status == ApplicationStatus.Pending || a.Status == ApplicationStatus.InReview) && !a.IsDeleted)
                .Include(a => a.Career)
                .Include(a => a.User)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Application>> GetApplicationsByCareerIdAsync(int careerId)
        {
            return await _context.Applications
                .Where(a => a.CareerId == careerId && !a.IsDeleted)
                .Include(a => a.User)
                .Include(a => a.ReviewedByUser)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Application>> GetApplicationsByUserIdAsync(int userId)
        {
            return await _context.Applications
                .Where(a => a.UserId == userId && !a.IsDeleted)
                .Include(a => a.Career)
                .ThenInclude(c => c.Company)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Application>> GetApplicationsByStatusAsync(ApplicationStatus status)
        {
            return await _context.Applications
                .Where(a => a.Status == status && !a.IsDeleted)
                .Include(a => a.Career)
                .Include(a => a.User)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }
    }
}
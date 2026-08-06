using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Repositories
{
    public class OfferRepository : GenericRepository<Offer>, IOfferRepository
    {
        public OfferRepository(AppDbContext context) : base(context) { }

        public async Task<Offer?> GetOfferWithDetailsByIdAsync(int id)
        {
            return await _context.Offers
                .Where(o => o.Id == id && !o.IsDeleted)
                .Include(o => o.Company)
                .Include(o => o.CompanyService)
                .Include(o => o.RequesterUser)
                .Include(o => o.RequirementFile)
                .Include(o => o.ProposalFile)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Offer>> GetOffersByCompanyIdAsync(int companyId)
        {
            return await _context.Offers
                .Where(o => o.CompanyId == companyId && !o.IsDeleted)
                .Include(o => o.CompanyService)
                .Include(o => o.RequesterUser)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Offer>> GetOffersByUserIdAsync(int userId)
        {
            return await _context.Offers
                .Where(o => o.RequesterUserId == userId && !o.IsDeleted)
                .Include(o => o.Company)
                .Include(o => o.CompanyService)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Offer>> GetOffersByStatusAsync(OfferStatus status)
        {
            return await _context.Offers
                .Where(o => o.Status == status && !o.IsDeleted)
                .Include(o => o.Company)
                .Include(o => o.CompanyService)
                .Include(o => o.RequesterUser)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
    }
}
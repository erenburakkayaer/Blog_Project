using Microsoft.EntityFrameworkCore;
using Staj_proje.Data;
using Staj_proje.Entities;
using Staj_proje.Interfaces;

namespace Staj_proje.Repositories
{
    public class BlogRepository : GenericRepository<Blog>, IBlogRepository
    {
        public BlogRepository(AppDbContext context) : base(context) { }

        // Tüm detayları (Kategori, Yazar, Görsel, Yorumlar) ile birlikte blog listesini getirir
        public async Task<List<Blog>> GetBlogsWithDetailsAsync()
        {
            return await _context.Blogs
                .Where(b => !b.IsDeleted)
                .Include(b => b.Category)
                .Include(b => b.Author)
                .Include(b => b.CoverImageAsset)
                .Include(b => b.BlogComments)
                .ToListAsync();
        }

        // Tek bir bloğu tüm detaylarıyla getirir
        public async Task<Blog?> GetBlogWithDetailsByIdAsync(int id)
        {
            return await _context.Blogs
                .Where(b => b.Id == id && !b.IsDeleted)
                .Include(b => b.Category)
                .Include(b => b.Author)
                .Include(b => b.CoverImageAsset)
                .Include(b => b.BlogComments)
                .FirstOrDefaultAsync();
        }

        // Sadece yayında olan ve silinmemiş blogları getirir
        public async Task<List<Blog>> GetPublishedBlogsAsync()
        {
            return await _context.Blogs
                .Where(b => b.IsPublished && !b.IsDeleted)
                .Include(b => b.Category)
                .Include(b => b.Author)
                .ToListAsync();
        }

        // Belirli bir kategoriye ait blogları getirir
        public async Task<List<Blog>> GetBlogsByCategoryIdAsync(int categoryId)
        {
            return await _context.Blogs
                .Where(b => b.CategoryId == categoryId && b.IsPublished && !b.IsDeleted)
                .Include(b => b.Author)
                .ToListAsync();
        }
    }
}
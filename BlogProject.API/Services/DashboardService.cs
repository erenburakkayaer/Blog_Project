using AutoMapper;
using BlogProject.API.DTO;
using BlogProject.API.Entities;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Services
{
    // Admin panel Dashboard'ı için özet istatistik/son içerik/son aktivite hesaplar
    public class DashboardService : IDashboardService
    {
        private readonly IGenericRepository<Blog> _blogRepository;
        private readonly IGenericRepository<Project> _projectRepository;
        private readonly IGenericRepository<CompanyService> _serviceRepository;
        private readonly IGenericRepository<Reference> _referenceRepository;
        private readonly IGenericRepository<Message> _messageRepository;
        private readonly IGenericRepository<Offer> _offerRepository;
        private readonly IGenericRepository<Log> _logRepository;
        private readonly IMapper _mapper;

        public DashboardService(
            IGenericRepository<Blog> blogRepository,
            IGenericRepository<Project> projectRepository,
            IGenericRepository<CompanyService> serviceRepository,
            IGenericRepository<Reference> referenceRepository,
            IGenericRepository<Message> messageRepository,
            IGenericRepository<Offer> offerRepository,
            IGenericRepository<Log> logRepository,
            IMapper mapper)
        {
            _blogRepository = blogRepository;
            _projectRepository = projectRepository;
            _serviceRepository = serviceRepository;
            _referenceRepository = referenceRepository;
            _messageRepository = messageRepository;
            _offerRepository = offerRepository;
            _logRepository = logRepository;
            _mapper = mapper;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync()
        {
            var blogs = (await _blogRepository.GetAllAsync()).ToList();
            var projects = (await _projectRepository.GetAllAsync()).ToList();
            var messages = (await _messageRepository.GetAllAsync()).ToList();

            return new DashboardSummaryDto
            {
                TotalBlogs = blogs.Count,
                TotalProjects = projects.Count,
                PublishedCount = blogs.Count(b => b.Status == "published") + projects.Count(p => p.Status == "published"),
                DraftCount = blogs.Count(b => b.Status == "draft") + projects.Count(p => p.Status == "draft"),
                FeaturedProjects = projects.Count(p => p.Featured),
                TotalServices = (await _serviceRepository.GetAllAsync()).Count(),
                TotalReferences = (await _referenceRepository.GetAllAsync()).Count(),
                TotalMessages = messages.Count,
                UnreadMessages = messages.Count(m => !m.IsRead),
                TotalOffers = (await _offerRepository.GetAllAsync()).Count()
            };
        }

        public async Task<IEnumerable<RecentContentDto>> GetRecentContentsAsync(int limit = 6)
        {
            var blogItems = (await _blogRepository.GetAllAsync()).Select(b => new RecentContentDto
            {
                Id = b.Id,
                Title = b.Title,
                Type = "Blog",
                Status = b.Status,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt
            });

            var projectItems = (await _projectRepository.GetAllAsync()).Select(p => new RecentContentDto
            {
                Id = p.Id,
                Title = p.Title,
                Type = "Proje",
                Status = p.Status,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            });

            return blogItems.Concat(projectItems)
                .OrderByDescending(item => item.UpdatedAt ?? item.CreatedAt)
                .Take(limit);
        }

        public async Task<IEnumerable<LogDto>> GetActivitiesAsync(int limit = 6)
        {
            var logs = await _logRepository.GetAllAsync();
            var recent = logs.OrderByDescending(l => l.CreatedAt).Take(limit);
            return _mapper.Map<IEnumerable<LogDto>>(recent);
        }
    }
}

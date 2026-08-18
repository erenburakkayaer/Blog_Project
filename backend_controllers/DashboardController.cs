using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Staj_proje.Services.Interfaces;

namespace Staj_proje.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SuperAdmin,Admin,Editor")]
    public class DashboardController : ControllerBase
    {
        private readonly IBlogService _blogService;
        private readonly IProjectService _projectService;
        private readonly IMessageService _messageService;
        private readonly IOfferService _offerService;
        private readonly IUserService _userService;

        public DashboardController(
            IBlogService blogService,
            IProjectService projectService,
            IMessageService messageService,
            IOfferService offerService,
            IUserService userService)
        {
            _blogService = blogService;
            _projectService = projectService;
            _messageService = messageService;
            _offerService = offerService;
            _userService = userService;
        }

        /// <summary>
        /// Admin Dashboard Özet İstatistiklerini Getirir
        /// </summary>
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalProjects = await _projectService.GetTotalProjectCountAsync();
            var activeProjects = await _projectService.GetActiveProjectCountAsync();
            var unreadMessages = await _messageService.GetUnreadMessageCountAsync();
            var pendingOffers = await _offerService.GetPendingOfferCountAsync();
            var totalUsers = await _userService.GetTotalUserCountAsync();

            var publishedBlogs = await _blogService.GetPublishedBlogsAsync();

            return Ok(new
            {
                totalProjects,
                activeProjects,
                totalBlogs = publishedBlogs.Count,
                unreadMessages,
                pendingOffers,
                totalUsers,
                totalWriterBalance = 1450.00, // TechNova yazar havuzu
                updatedAt = DateTime.UtcNow
            });
        }
    }
}

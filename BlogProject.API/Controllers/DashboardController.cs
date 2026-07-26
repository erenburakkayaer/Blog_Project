using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BlogProject.API.DTO;
using BlogProject.API.Interfaces;

namespace BlogProject.API.Controllers
{
    // Samet'in (frontend) Frontend_Backend_Bilgilendirme_Raporu.txt'te istediği uçlar —
    // Dashboard şu an client-side hesaplıyor ama bu uçlar hazır olunca kolayca bağlanabilir
    [ApiController]
    [Route("api/dashboard")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary() =>
            Ok(await _dashboardService.GetSummaryAsync());

        [HttpGet("recent-contents")]
        public async Task<ActionResult<IEnumerable<RecentContentDto>>> GetRecentContents([FromQuery] int limit = 6) =>
            Ok(await _dashboardService.GetRecentContentsAsync(limit));

        [HttpGet("activities")]
        public async Task<ActionResult<IEnumerable<LogDto>>> GetActivities([FromQuery] int limit = 6) =>
            Ok(await _dashboardService.GetActivitiesAsync(limit));
    }
}

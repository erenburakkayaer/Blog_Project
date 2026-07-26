using BlogProject.API.DTO;

namespace BlogProject.API.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetSummaryAsync();
        Task<IEnumerable<RecentContentDto>> GetRecentContentsAsync(int limit = 6);
        Task<IEnumerable<LogDto>> GetActivitiesAsync(int limit = 6);
    }
}

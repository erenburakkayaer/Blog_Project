namespace BlogProject.API.DTO
{
    public class DashboardSummaryDto
    {
        public int TotalBlogs { get; set; }
        public int TotalProjects { get; set; }
        public int PublishedCount { get; set; }
        public int DraftCount { get; set; }
        public int FeaturedProjects { get; set; }
        public int TotalServices { get; set; }
        public int TotalReferences { get; set; }
        public int TotalMessages { get; set; }
        public int UnreadMessages { get; set; }
        public int TotalOffers { get; set; }
    }
}

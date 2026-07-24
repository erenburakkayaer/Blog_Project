namespace BlogProject.API.Entities
{
    // Kariyer başvurusu (CV)
    public class Application
    {
        public int Id { get; set; }
        public int CareerId { get; set; }
        public Career? Career { get; set; }

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string CvFileUrl { get; set; } = string.Empty;

        public bool IsReviewed { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

namespace BlogProject.API.Entities
{
    // İş ilanları
    public class Career
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Location { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; }

        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
